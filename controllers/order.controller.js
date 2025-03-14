const Order = require("../models/order.model.js");
const User = require("../models/user.model.js");
const Address = require("../models/address.model.js");
// const Product = require("../models/product.model.js");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      userId,
      customer, // { name, email, phone }
      shippingAddress, // Either an ObjectId or a full custom address object
      billingAddress, // Optional; either an ObjectId or a full custom address object
      items,
      total,
      paymentMethod,
    } = req.body;

    if (!userId || !customer || !items || !total || !paymentMethod) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let shippingAddrId;
    let billingAddrId;

    // Handle Shipping Address:
    if (typeof shippingAddress === "string") {
      const shippingAddr = await Address.findById(shippingAddress);
      if (!shippingAddr) {
        return res.status(400).json({ error: "Invalid shipping address ID" });
      }
      shippingAddrId = shippingAddress;
    } else if (typeof shippingAddress === "object") {
      const newShipping = await Address.create({
        country: shippingAddress.country,
        street_address: shippingAddress.street_address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pin_code: shippingAddress.pin_code,
      });
      shippingAddrId = newShipping._id;
    } else {
      return res.status(400).json({ error: "Shipping address is required" });
    }

    // Handle Billing Address:
    if (!billingAddress) {
      billingAddrId = shippingAddrId;
    } else if (typeof billingAddress === "string") {
      const billingAddr = await Address.findById(billingAddress);
      if (!billingAddr) {
        return res.status(400).json({ error: "Invalid billing address ID" });
      }
      billingAddrId = billingAddress;
    } else if (typeof billingAddress === "object") {
      const newBilling = await Address.create({
        country: billingAddress.country,
        street_address: billingAddress.street_address,
        city: billingAddress.city,
        state: billingAddress.state,
        pin_code: billingAddress.pin_code,
      });
      billingAddrId = newBilling._id;
    }

    const newOrder = new Order({
      userId,
      customer,
      billingAddress: billingAddrId,
      shippingAddress: shippingAddrId,
      items,
      total,
      paymentMethod,
    });

    await newOrder.save();

    return res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//!  Attach Product Images (Commented Out because products don't exist yet)

// const attachProductImages = async (orders) => {
//   const enhanceOrder = async (order) => {
//     const enhancedItems = await Promise.all(
//       order.items.map(async (item) => {
//         const product = await Product.findOne({ sku: item.sku });
//         const image = product && product.images && product.images.length > 0
//           ? product.images[0] // Attach the first image of the product
//           : null;
//         return { ...item.toObject(), image }; // Attach image URL to the item
//       })
//     );
//     order.items = enhancedItems;
//     return order;
//   };

//   if (Array.isArray(orders)) {
//     return await Promise.all(orders.map(enhanceOrder));
//   } else {
//     return await enhanceOrder(orders);
//   }
// };

// Get All Orders (Without Product Images) ===== */

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email phone")
      .populate("billingAddress")
      .populate("shippingAddress");

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get All Orders with Product Images

// exports.getOrders = async (req, res) => {
//   try {
//     let orders = await Order.find()
//       .populate("userId", "name email phone")
//       .populate("billingAddress")
//       .populate("shippingAddress");

//     orders = await attachProductImages(orders); // Attach Images

//     return res.status(200).json(orders);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// Get Order By ID (Without Product Images)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("billingAddress")
      .populate("shippingAddress");

    if (!order) return res.status(404).json({ error: "Order not found" });

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get Order By ID with Product Images
// exports.getOrderById = async (req, res) => {
//   try {
//     let order = await Order.findById(req.params.id)
//       .populate("userId", "name email phone")
//       .populate("billingAddress")
//       .populate("shippingAddress");

//     if (!order) return res.status(404).json({ error: "Order not found" });

//     order = await attachProductImages(order); // Attach Images

//     return res.status(200).json(order);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// Get Orders for a User (Without Product Images)
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Orders for a User with Product Images
// exports.getUserOrders = async (req, res) => {
//   try {
//     const { userId } = req.query;

//     if (!userId) {
//       return res.status(400).json({ error: "User ID is required" });
//     }

//     let orders = await Order.find({ userId });

//     if (!orders.length) {
//       return res.status(404).json({ message: "No orders found for this user" });
//     }

//     orders = await attachProductImages(orders); // Attach Images

//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder)
      return res.status(404).json({ error: "Order not found" });
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
