const express = require("express")
const { addToCart, getCartItems, removeItem } = require("../controllers/eshop/cart.controller")
const router = express.Router()

router.post("/add-to-cart",addToCart) 
router.get("/get-items",getCartItems) 
router.post("/remove-item",removeItem) 

module.exports = router;