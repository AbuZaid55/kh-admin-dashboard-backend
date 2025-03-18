const mongoose = require("mongoose")

const cartSchema_eshop = new mongoose.Schema({
    user_id: {type:String,required:true},
    items:[
        {
            product:{ type: mongoose.Schema.Types.ObjectId, ref: "Product_eshop",required:true },
            color:{ type: mongoose.Schema.Types.ObjectId, ref: "Color_eshop",required:true },
            grade:{type:String,requried:true},
            carat:{type:String,requried:true},
            size:{type:String,required:true},
            qty:{type:Number,required:true,default:1}
        }
    ]
})

const Cart = mongoose.model("Cart_eshop",cartSchema_eshop)
module.exports = Cart;