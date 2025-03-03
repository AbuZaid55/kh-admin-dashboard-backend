const Category_eshop = require("../../models/eshop/category.model");
const Collection_eshop = require("../../models/eshop/collection.model");
const Products_eshop = require("../../models/eshop/product.model");
const Style_eshop = require("../../models/eshop/style.model");
const { deleteFileFromS3 } = require("../../services/S3_Services");

const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) throw new Error("Enter Category Name");
    const image = req.imageUrl;
    
    // Create new Category
    const newCategory = new Category_eshop({ name,description, image });
    await newCategory.save();

    res.status(200).json({ message: "Category Added Successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const data = await Category_eshop.find({}).populate("styles")
    res.status(200).json(data)
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getStyles = async (req, res) => {
  try {
    const id = req.params?.id;
    if (!id) throw new Error("Select Category");
    const data = await Category_eshop.findById(id).populate("styles");
    const styles = data?.styles ? data.styles : []
    res.status(200).json(styles);
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
};

const updateCategory = async(req,res)=>{
  try {
    const id = req.params?.id;
    const { name, description } = req.body;
    if (!name) throw new Error("Enter Category Name");
    const image = req.imageUrl;
    const data = await Category_eshop.findById(id)
    if(!data) throw new Error("Category not exist!")
    if(image?.key){
      data?.image?.key && deleteFileFromS3(data?.image?.key)
      data.image = image
    }
    data.name = name
    data.description = description 
    await data.save()
    res.status(200).json({message:"Updated Successfully"})
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const deleteCategory = async(req,res)=>{
  try {
    const id = req.params?.id;
    const category = await Category_eshop.findById(id)
    if(!category) throw new Error("Category is not exist!")
    await Style_eshop.deleteMany({_id:{$in:category.styles}})
    if(category.image?.key){
      deleteFileFromS3(category.image?.key)
    }
    await Category_eshop.deleteOne({_id:category._id})
    await Products_eshop.deleteMany({category:id})
    res.status(200).json({message:"Deleted Successfully"})
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { addCategory, getAllCategories,getStyles,updateCategory,deleteCategory};
