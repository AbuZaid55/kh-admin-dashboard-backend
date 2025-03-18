const User = require("../../models/user.model");
const Product_eshop = require("../../models/eshop/product.model");
const Cart_eshop = require("../../models/eshop/cart.model");
const getPrice = require("../../utils/getPrices");

const addToCart = async (req, res) => {
  const user_id = req?.user?.id;
  try {
    const { product: product_id, color, grade, carat, size } = req.body;
    if (!color) throw new Error("Select Color");
    if (!grade) throw new Error("Select Diamond Grade");
    if (!carat) throw new Error("Select Gold Carat");
    if (!user_id) throw new Error("Unauthorized User!");
    if (!product_id) throw new Error("Product id not found!");
    const user = await User.findById(user_id);
    if (!user) throw new Error("User not found");
    const product = await Product_eshop.findById(product_id);
    if (!product) throw new Error("Product not found!");
    const obj = { product: product_id, color, grade, carat };
    if (size) obj.size = size;
    const cart = await Cart_eshop.findOne({ user_id: user_id });
    if (!cart) {
      await Cart_eshop({ user_id, items: [obj] }).save();
    } else {
      let isExist = false;
      cart.items.forEach((item) => {
        if (item.product.toString() === product_id && item.grade === grade && item.carat === carat && item.color.toString() === color && item.size === size) {
          item.qty += 1;
          isExist = true;
        }
      });
      if (!isExist) {
        cart.items.unshift(obj);
      }
      await cart.save();
    }
    res.status(200).json({ message: "Item Added" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCartItems = async (req, res) => {
  try {
    const user_id = req?.user?.id;
    const data = await Cart_eshop.findOne({ user_id: user_id })
      .populate({
        path: "items.product",
        populate: [
          "diamond_discount",
          "gold_discount",
          "discount_on_total",
          "labor",
          "diamonds.diamond",
          {
            path: "golds",
            populate: [{ path: "making_charge" }, { path: "wastage_charge" }],
          },
        ],
      })
      .populate("items.color")
      .lean();
    data?.items.map((item) => {
      const prices = getPrice(item.product);
      let _price = 0;
      prices.map((obj) => {
        if (obj.carat === item.carat && obj.grade === item.grade) {
          _price = obj.finalTotalPrice;
        }
      });
      item.price = _price;
    });
    let _totalPrice = 0
    data?.items?.map((item)=>{
        _totalPrice = _totalPrice + item.price * item.qty
    })
    data.subTotal = _totalPrice
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeItem = async(req,res)=>{
    const user_id = req?.user?.id;
    try {
        const {_id} = req.body 
        const cart = await Cart_eshop.findOne({user_id:user_id})
        if(!cart) throw new Error("Cart not found!")
        const items = cart.items.filter((item)=>item._id!=_id)
        cart.items = items
        await cart.save()
        res.status(200).json({message:"Removed item"})
    } catch (error) {
       res.status(400).json({ error: error.message });
    }
}

module.exports = { addToCart, getCartItems, removeItem };
