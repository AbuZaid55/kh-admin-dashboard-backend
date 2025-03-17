const xlsx = require("xlsx");
const fs = require("fs");
const Product = require("../../models/khwaahish/product.model");
const Style = require("../../models/khwaahish/style.model");
const Category = require("../../models/khwaahish/category.model");
const Collection = require("../../models/khwaahish/collection.model");

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

    const productList = [];
    let count = 0;

    for (let item of jsonData) {
      let styleId = null;
      let categoryId = null;
      let collectionId = null;
      let images = [];

      //Check if Product Already Exists
      const existingProduct = await Product.findOne({
        $or: [{ sku: item.SKU }, { name: { $regex: new RegExp(`^${item?.Name.trim()}`, "i") } }],
      });
      if (existingProduct) {
        continue;
      }

      //   Handle Styles
      if (item["Style"]) {
        const style = item["Style"].trim();

        let existingStyle = await Style.findOne({ name: { $regex: new RegExp(`^${style}$`, "i") } });
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
        let existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, "i") } });

        if (existingCategory) {
          categoryId = existingCategory._id;
        } else {
          const newCategory = await Category.create({
            name: categoryName,
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
          name: { $regex: new RegExp(`^${collectionName}$`, "i") },
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

      if (item["Images"]) {
        const _images = item["Images"]
          .split(",")
          .map((image) => image.trim()) 
          .filter((image) => image) 
          .map((image) => ({ key: "", url: image }));
        images = _images;
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
        images:images || [],
        product_weight: item.product_weight || 0,
        gold_weight: item.gold_weight || 0,
        diamond_weight: item.diamond_weight || 0,
        diamond_quality: item.diamond_quality || 0,
        gemstone_name: item.gemstone_name,
        gemstone_price: item.gemstone_price,
        gemstone_weight: item.gemstone_weight || 0,
        gemstone_type: item.gemstone_type || "",
        whatsapp_link:item.WhatsApp_link || '',
        youtube_link:item.Youtube_link || '',
        height: item.height,
        width: item.width,
      };

      productList.push(productData);
      count = count + 1;

      console.log(count, " Product Inserted");
    }
    await Product.insertMany(productList);
    console.log("All Data Imported Successfully.");
    res.status(200).json({ message: "Inserted Successfully" });
  } catch (err) {
    console.error("Error Inserting Data:", err);
    res.status(400).json(err.message);
  }
};

module.exports = { bulkUploadXlsx };
