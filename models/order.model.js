const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  billingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  items: [
    {
      productName: { type: String, required: true },
      sku: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  status: {
    type: String,
    enum: [
      "Pending",
      "Processing",
      "Completed",
      "Cancelled",
      "Refunded",
      "Failed",
    ],
    default: "Pending",
  },
  total: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["Credit Card", "PayPal", "Bank Transfer", "UPI"],
    required: true,
  },
  orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
