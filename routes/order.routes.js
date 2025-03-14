const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getUserOrders
} = require('../controllers/order.controller');

const router = express.Router();

// Create a new order
router.post('/', createOrder);

// Get all orders
router.get('/', getOrders);

// Get orders for a specific user (expects userId as a query parameter)
router.get('/user-orders', getUserOrders);

// Update order status
router.put('/:id/status', updateOrderStatus);

// Get an order by its ID
router.get('/:id', getOrderById);

// Delete an order
router.delete('/:id', deleteOrder);

module.exports = router;
