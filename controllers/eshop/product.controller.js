const Collection_eshop = require("../../models/eshop/collection.model.js");
const Category_eshop = require("../../models/eshop/category.model.js");
const Style_eshop = require("../../models/eshop/style.model.js");
const Product_eshop = require("../../models/eshop/product.model.js");
const Recommended_eshop = require("../../models/eshop/recommended.model.js");
const redisClient = require("../../config/redis.js");
const { deleteFileFromS3 } = require("../../services/S3_Services.js");

const addProduct = async (req, res) => {
  try {
    req.body = JSON.parse(req?.body?.productData);

    const { name, sku, collection, category, golds, diamonds, labor } = req.body;

    if (!name) throw new Error("Enter Name");
    if (!sku) throw new Error("Enter Sku");
    if (!collection) throw new Error("Select Collection");
    if (!category) throw new Error("Select Category");
    if (!diamonds || diamonds.length <= 0) throw new Error("Select Diamond Variant");
    if (!golds || golds.length <= 0) throw new Error("Select Gold Variant");
    let Labor = labor ? labor : null;

    req.body.color1 = req.body.color1 || null;
    req.body.color2 = req.body.color2 || null;
    req.body.color3 = req.body.color3 || null;

    req.body.images1 = req.imageUrls1 || [];
    req.body.images2 = req.imageUrls2 || [];
    req.body.images3 = req.imageUrls3 || [];

    req.body.style = req.body.style || null;

    await Product_eshop({ ...req.body, labor: Labor }).save();

    res.status(200).json({ message: "Added successfully" });
  } catch (error) {
    if (req?.imageUrls1?.length > 0) {
      req.imageUrls1.map((obj) => {
        deleteFileFromS3(obj.key);
      });
    }
    if (req?.imageUrls2?.length > 0) {
      req.imageUrls2.map((obj) => {
        deleteFileFromS3(obj.key);
      });
    }
    if (req?.imageUrls3?.length > 0) {
      req.imageUrls3.map((obj) => {
        deleteFileFromS3(obj.key);
      });
    }
    res.status(400).json({ error: error.message });
  }
};

const getProducts = async (req, res) => {
  let bestSellersProducts = [];
  let trendingProducts = [];
  // const redisBestSeller = await redisClient.get("best_seller_products");
  // const redisTrending = await redisClient.get("trending_products");
  const redisBestSeller = false;
  const redisTrending = false;
  if (redisBestSeller) {
    bestSellersProducts = JSON.parse(redisBestSeller);
  } else {
    let bestSeller_products = await Product_eshop.find().select("_id").sort({ orders: -1 }).limit(2);
    bestSellersProducts = bestSeller_products.map((product) => product._id.toString());
    await redisClient.set("best_seller_products", JSON.stringify(bestSellersProducts), { EX: 24 * 60 * 60 });
  }
  if (redisTrending) {
    trendingProducts = JSON.parse(redisTrending);
  } else {
    let trending_products = await Product_eshop.find().select("_id").sort({ views: -1 }).limit(2);
    trendingProducts = trending_products.map((product) => product._id.toString());
    await redisClient.set("trending_products", JSON.stringify(trendingProducts), { EX: 24 * 60 * 60 });
  }

  try {
    const { collection, category, style, recommendedId, best_seller, trending, new_arrival, page, limit } = req.body;

    let filter = {};
    const skip = (page - 1) * limit;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    if (collection) filter.collection = collection;
    if (category) filter.category = category;
    if (style) filter.style = style;
    if (recommendedId?.length > 0) filter.recommendedFor = { $all: recommendedId };
    if (best_seller && trending) {
      const commonIds = bestSellersProducts.filter((id) => trendingProducts.includes(id));
      filter._id = { $in: commonIds };
    } else if (best_seller) {
      filter._id = { $in: bestSellersProducts };
    } else if (trending) {
      filter._id = { $in: trendingProducts };
    }
    if (new_arrival) filter.createdAt = { $gte: sevenDaysAgo };

    const [uniqueCategories, uniqueStyles, totalRecords] = await Promise.all([Product_eshop.distinct("category", filter), Product_eshop.distinct("style", filter), Product_eshop.countDocuments(filter)]);

    const categories = await Category_eshop.find({ _id: { $in: uniqueCategories } }).select("name");
    const styles = await Style_eshop.find({ _id: { $in: uniqueStyles } }).select("name");

    let data = await Product_eshop.find(filter)
      .populate([
        "diamond_discount",
        "color1",
        "color2",
        "color3",
        "gold_discount",
        "discount_on_total",
        "labor",
        "diamonds.diamond",
        {
          path: "golds",
          populate: [{ path: "making_charge" }, { path: "wastage_charge" }],
        },
        {
          path: "recommendedFor",
          select: "name",
        },
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    let newData = data.map((product) => {
       if (product?._id) {
      product.best_seller = bestSellersProducts.includes(product._id.toString());
      product.trending = trendingProducts.includes(product._id.toString());
    
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      product.new_arrival = new Date(product.createdAt) >= sevenDaysAgo;
    }
      return product;
    });

    const uniqueRecommendedIds = [...new Set(data.flatMap((product) => product.recommendedFor?.map((rec) => rec._id)))];

    const recommendedNames = await Recommended_eshop.find({ _id: { $in: uniqueRecommendedIds } }).select("name");

    res.status(200).json({ products: newData, categories, styles, recommendeds: recommendedNames, totalRecords: totalRecords });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProductsForDiscount = async (req, res) => {
  try {
    const { _id, collection, category, style } = req.body;

    let filter = {};

    if (_id) filter._id = _id;
    if (collection) filter.collection = collection;
    if (category) filter.category = category;
    if (style) filter.style = style;

    const data = await Product_eshop.find(filter).sort({ createdAt: -1 });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const _id = req.params?.id;
    if (!_id) throw new Error("Product Id not found!");
    const data = await Product_eshop.findById(_id).populate([
      "collection",
      "category",
      "style",
      "recommendedFor",
      "color1",
      "color2",
      "color3",
      "diamond_discount",
      "gold_discount",
      "discount_on_total",
      "labor",
      "golds",
      "diamonds.diamond",
      {
        path: "golds",
        populate: [{ path: "making_charge" }, { path: "wastage_charge" }],
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProductByName = async (req, res) => {
  let bestSellersProducts = [];
  let trendingProducts = [];
  // const redisBestSeller = await redisClient.get("best_seller_products");
  // const redisTrending = await redisClient.get("trending_products");
  const redisBestSeller = false;
  const redisTrending = false;
  if (redisBestSeller) {
    bestSellersProducts = JSON.parse(redisBestSeller);
  } else {
    let bestSeller_products = await Product_eshop.find().select("_id").sort({ orders: -1 }).limit(2);
    bestSellersProducts = bestSeller_products.map((product) => product._id.toString());
    await redisClient.set("best_seller_products", JSON.stringify(bestSellersProducts), { EX: 24 * 60 * 60 });
  }
  if (redisTrending) {
    trendingProducts = JSON.parse(redisTrending);
  } else {
    let trending_products = await Product_eshop.find().select("_id").sort({ views: -1 }).limit(2);
    trendingProducts = trending_products.map((product) => product._id.toString());
    await redisClient.set("trending_products", JSON.stringify(trendingProducts), { EX: 24 * 60 * 60 });
  }
  try {
    const name = req?.params?.name;
    let product = await Product_eshop.findOneAndUpdate(
      { name: { $regex: new RegExp(`^${name}$`, "i") } },
      { $inc: { views: 1 } }, 
      { new: true, lean: true } 
    ).populate([
      "collection",
      "category",
      "style",
      "diamond_discount",
      "color1",
      "color2",
      "color3",
      "gold_discount",
      "discount_on_total",
      "labor",
      "diamonds.diamond",
      "recommendedFor",
      {
        path: "golds",
        populate: [{ path: "making_charge" }, { path: "wastage_charge" }],
      },
    ]);
    if (product?._id) {
      product.best_seller = bestSellersProducts.includes(product._id.toString());
      product.trending = trendingProducts.includes(product._id.toString());
    
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      product.new_arrival = new Date(product.createdAt) >= sevenDaysAgo;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProductForUpdate = async (req, res) => {
  try {
    const _id = req.params?.id;
    if (!_id) throw new Error("Product Id not found!");
    const data = await Product_eshop.findById(_id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const _id = req.params?.id;
    const product = await Product_eshop.findById(_id);
    req.body = JSON.parse(req?.body?.productData);

    const { name, sku, collection, category, golds, diamonds, labor } = req.body;

    if (!name) throw new Error("Enter Name");
    if (!sku) throw new Error("Enter Sku");
    if (!collection) throw new Error("Select Collection");
    if (!category) throw new Error("Select Category");
    if (!diamonds || diamonds.length <= 0) throw new Error("Select Diamond Variant");
    if (!golds || golds.length <= 0) throw new Error("Select Gold Variant");
    let Labor = labor ? labor : null;

    req.body.color1 = req.body.color1 || null;
    req.body.color2 = req.body.color2 || null;
    req.body.color3 = req.body.color3 || null;

    delete req.body["images1"];
    delete req.body["images2"];
    delete req.body["images3"];

    const updateData = {};

    if (req.imageUrls1 && req.imageUrls1.length > 0) {
      updateData.images1 = req.imageUrls1;
      product.images1.map((obj) => {
        deleteFileFromS3(obj.key);
      });
    }

    if (req.imageUrls2 && req.imageUrls2.length > 0) {
      updateData.images2 = req.imageUrls2;
      product.images2.map((obj) => {
        deleteFileFromS3(obj.key);
      });
    }

    if (req.imageUrls3 && req.imageUrls3.length > 0) {
      updateData.images3 = req.imageUrls3;
      product.images3.map((obj) => {
        deleteFileFromS3(obj.key);
      });
    }

    req.body.style = req.body.style || null;

    await Product_eshop.findByIdAndUpdate(_id, { ...req.body, ...updateData, labor: Labor });

    res.status(200).json({ message: "Updated Successfully" });
  } catch (error) {
    if (req.imageUrls1.length > 0) {
      req.imageUrls1.map((obj) => {
        deleteFileFromS3(obj.key);
      });
    }
    if (req.imageUrls2.length > 0) {
      req.imageUrls2.map((obj) => {
        deleteFileFromS3(obj.key);
      });
    }
    if (req.imageUrls3.length > 0) {
      req.imageUrls3.map((obj) => {
        deleteFileFromS3(obj.key);
      });
    }
    res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params?.id;
    const product = await Product_eshop.findById(id);
    if (!product) throw new Error("Product not found!");
    product.images1.map((obj) => {
      deleteFileFromS3(obj.key);
    });
    product.images2.map((obj) => {
      deleteFileFromS3(obj.key);
    });
    product.images3.map((obj) => {
      deleteFileFromS3(obj.key);
    });
    await Product_eshop.findByIdAndDelete(product._id);
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    if (!string) {
      return res.status(400).json({ error: "Search string is required." });
    }

    const data = await Product_eshop.find({
      $or: [
        { name: { $regex: string, $options: "i" } }, 
        { sku: { $regex: string, $options: "i" } }, 
        { description: { $regex: string, $options: "i" } }, 
        { gemstone_name: { $regex: string, $options: "i" } }
      ],
    }).populate([
      "diamond_discount",
      "color1",
      "color2",
      "color3",
      "gold_discount",
      "discount_on_total",
      "labor",
      "diamonds.diamond",
      {
        path: "golds",
        populate: [{ path: "making_charge" }, { path: "wastage_charge" }],
      },
      {
        path: "recommendedFor",
        select: "name",
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { addProduct, getProducts, getProductsForDiscount, getProductById, getProductByName, getProductForUpdate, updateProduct, deleteProduct, searchProducts };
