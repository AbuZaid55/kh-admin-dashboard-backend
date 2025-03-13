const xlsx = require("xlsx");
const fs = require("fs");
const Product = require("../../models/eshop/product.model");
const Style = require("../../models/eshop/style.model");
const Category = require("../../models/eshop/category.model");
const Collection = require("../../models/eshop/collection.model");
const Color = require("../../models/eshop/color.model");
const Gold = require("../../models/eshop/gold.model");
const Diamond = require("../../models/eshop/diamond.model");
const Labor = require("../../models/eshop/labor.model");
const RecommendedFor = require("../../models/eshop/recommended.model");

const bulkUploadXlsx = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    let jsonData = [];
    const fileBuffer = req.file.buffer;

    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    jsonData = xlsx.utils.sheet_to_json(sheet, {
      defval: null,
    });

    if (jsonData.length === 0) {
      throw new Error("File is empty or improperly formatted.");
    }

    const productList = []
    let count = 0

    for (let item of jsonData) {
      let styleId = null;
      let categoryId = null;
      let collectionId = null;
      let color1Id = null;
      let color2Id = null;
      let color3Id = null;
      let images1 = [];
      let images2 = [];
      let images3 = [];
      let goldIds = [];
      let diamondArray = [];

      //Check if Product Already Exists
      const existingProduct = await Product.findOne({
        $or: [{ sku: item.SKU }, { name: item.Name }],
      });      
      if (existingProduct) {
        continue;
      }

      //   Handle Styles
      if (item["Style"]) {
        const style = item["Style"].trim();

        let existingStyle = await Style.findOne({ name: style });
        if (existingStyle) {
          styleId = existingStyle._id;
        } else {
          const newStyle = await Style.create({
            name: style,
            image: { key: "", url: "" },
          });
          styleId = newStyle._id;
        }
      }

      // Handle Category
      if (item["Category"]) {
        const categoryName = item["Category"].trim();
        let existingCategory = await Category.findOne({ name: categoryName });

        if (existingCategory) {
          const existingStyleIds = existingCategory.styles.map((id) => id.toString());
          const isExistStyle = existingStyleIds.includes(styleId.toString());

          if (!isExistStyle) {
            existingCategory.styles.push(styleId);
            await existingCategory.save();
          }
          categoryId = existingCategory._id;
        } else {
          const newCategory = await Category.create({
            name: categoryName,
            styles: [styleId],
            image: { key: "", url: "" },
            description: "",
          });
          categoryId = newCategory._id;
        }
      }

      //Handle Collection
      if (item["Collection"]) {
        const collectionName = item["Collection"].trim();
        let existingCollection = await Collection.findOne({
          name: collectionName,
        });

        if (existingCollection) {
          collectionId = existingCollection._id;
        } else {
          const newCollection = await Collection.create({
            name: collectionName,
            tagline: item.tagline || "",
            description: item.description || "",
            image: {
              key: "",
              url: "",
            },
          });
          collectionId = newCollection._id;
        }
      }
      // Handle Colors
      if (item["Color1"]) {
        const colorName = item["Color1"].trim();
        const existColor = await Color.findOne({ name: colorName });
        if (existColor) {
          color1Id = existColor._id;
        } else {
          const newColor = await Color.create({
            name: colorName,
            color_code: "#000000",
          });
          color1Id = newColor._id;
        }
      }

      if (item["Color2"]) {
        const colorName = item["Color2"].trim();
        const existColor = await Color.findOne({ name: colorName });
        if (existColor) {
          color2Id = existColor._id;
        } else {
          const newColor = await Color.create({
            name: colorName,
            color_code: "#000000",
          });
          color2Id = newColor._id;
        }
      }

      if (item["Color3"]) {
        const colorName = item["Color3"].trim();
        const existColor = await Color.findOne({ name: colorName });
        if (existColor) {
          color3Id = existColor._id;
        } else {
          const newColor = await Color.create({
            name: colorName,
            color_code: "#000000",
          });
          color3Id = newColor._id;
        }
      }

      if (item["Image1"]) {
        const images = item["Image1"]
          .split(",")
          .map((image) => image.trim()) // Trim whitespace
          .filter((image) => image) // Remove empty values
          .map((image) => ({ key: "", url: image }));
        images1 = images;
      }
      if (item["Image2"]) {
        const images = item["Image2"]
          .split(",")
          .map((image) => image.trim()) // Trim whitespace
          .filter((image) => image) // Remove empty values
          .map((image) => ({ key: "", url: image }));
        images2 = images;
      }
      if (item["Image3"]) {
        const images = item["Image3"]
          .split(",")
          .map((image) => image.trim()) // Trim whitespace
          .filter((image) => image) // Remove empty values
          .map((image) => ({ key: "", url: image }));
        images3 = images;
      }

      //  Handle Golds
      if (item["Gold_carat"]) {
        item["goldArray"] = item["Gold_carat"].split("|").map((carat) => ({ carat: carat.trim() }));
      }
      if (item.goldArray) {
        for (let gold of item.goldArray) {
          let existingGold = await Gold.findOne({ carat: gold.carat });
          if (existingGold) {
            goldIds.push(existingGold._id);
          } else {
            const newGold = await Gold.create({
              carat: gold.carat,
              pricePerGram: 0,
              making_charge: null,
              wastage_charge: null,
            });
            goldIds.push(newGold._id);
          }
        }
      }

      // Handle Grades
      item["grade"] = item["Diamond_grade"] ? item["Diamond_grade"].split("|") : [];

      //  Handle Diamonds
      if (item["diamond_shapes"]) {
        const diamondShapes = item["diamond_shapes"].split("|");
        for (let shape of diamondShapes) {
          for (let grade of item.grade) {
            let existingDiamond = await Diamond.findOne({
              grade: grade.trim(),
              variant: { $regex: new RegExp(`\\b${shape}\\b`, "i") },
            });

            if (!existingDiamond) {
              existingDiamond = await Diamond.create({
                grade,
                variant: shape,
                priceRanges: [],
              });
            }

            const pcs = [];
            for (let i = 1; i <= 20; i++) {
              let pcsKey = `${shape.trim()}_diamond_pcs${i}`;
              let weightKey = `${shape.trim()}_diamond_weight${i}`;
              if (item[pcsKey] && item[weightKey]) {
                pcs.push({ count: item[pcsKey], weight: item[weightKey] });
              }
            }

            diamondArray.push({
              diamond: existingDiamond._id,
              same_pcs: pcs.length,
              pcs: pcs.map(({ count, weight }) => ({ count, weight })),
              _id: false,
            });
          }
        }
      }
      // Handle Labor
      let laborId = null;
      if (item["gold_labor_types"]) {
        let existingLabor = await Labor.findOne({
          type: item["gold_labor_types"],
        });
        if (existingLabor) {
          laborId = existingLabor._id;
        } else {
          let newLabor = await Labor.create({
            type: item["gold_labor_types"],
            price: item["gold_labor_price"] || 0,
          });
          laborId = newLabor._id;
        }
      }

      // Handle RecommendedFor
      let recommendedForIds = [];
      if (item["recommended_for"]) {
        const recommendedForList = item["recommended_for"].split("|");
        for (let recommendName of recommendedForList) {
          let existingRecommend = await RecommendedFor.findOne({
            name: recommendName.trim(),
          });
          if (existingRecommend) {
            recommendedForIds.push(existingRecommend._id);
          } else {
            let newRecommend = await RecommendedFor.create({
              name: recommendName.trim(),
              image: { key: "", url: "" },
            });
            recommendedForIds.push(newRecommend._id);
          }
        }
      }

      // Create Product
      const productData = {
        name: item.Name,
        sku: item.SKU,
        description: item.Description,
        category: categoryId,
        style: styleId,
        stock: item.Stock || 0,
        collection: collectionId,
        color1: color1Id,
        color2: color2Id,
        color3: color3Id,
        images1: images1,
        images2: images2,
        images3: images3,
        product_weight: item.product_weight || 0,
        total_gold_weight: item.gold_weight || 0,
        golds: goldIds,
        diamonds: diamondArray,
        gemstone_name: item.gemstone_name,
        gemstone_price: item.gemstone_price,
        gemstone_weight: item.gemstone_weight || 0,
        gemstone_type: item.gemstone_type || "",
        labor: laborId,
        pearl_cost: item.pearl_cost,
        extra_cost: item.extra_cost,
        extra_fee: item.extra_fee,
        gst_percent: item.gst_percent,
        recommendedFor: recommendedForIds,
      };

      // productList.push(productData)
      count = count+1

      console.log(count," Product Inserted")

      await Product(productData).save()
    }
    console.log("All Data Imported Successfully.");
    res.status(200).json({ message: "Inserted Successfully" });
  } catch (err) {
    console.error("Error Inserting Data:", err);
    res.status(400).json(err.message);
  }
};

module.exports = { bulkUploadXlsx };
