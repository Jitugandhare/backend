const express = require("express");
const Order = require("../models/order.model.js");
const Cart = require("../models/cart.model.js");
const Product = require("../models/product.model.js");
const authMiddleware = require("../middleware/auth.middleware.js");

const router = express.Router();



router.post("/place", authMiddleware, async (req, res) => {
  const { shippingAddress } = req.body;
  const userId = req.user.id;

  if (!shippingAddress) {
    return res.status(400).json({ msg: "Shipping address is required" });
  }

  let cart = await Cart.findOne({ userId });
  if (!cart || cart.products.length === 0) {
    return res.status(400).json({ msg: "Your cart is empty" });
  }

  let totalPrice = 0;
  const orderProducts = [];

  for (let item of cart.products) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return res.status(400).json({ msg: `Product not found for ID ${item.productId}` });
    }

    
    if (product.price == null || isNaN(product.price)) {
      return res.status(400).json({ msg: `Product ${product.name} does not have a valid price` });
    }

    
    if (product.stock < item.quantity) {
      return res.status(400).json({ msg: `Not enough stock for ${product.name}` });
    }

    totalPrice += product.price * item.quantity;
    orderProducts.push({
      productId: item.productId,
      quantity: item.quantity,
      price: product.price,
    });
  }

  const order = new Order({
    userId,
    products: orderProducts,
    totalPrice,
    shippingAddress,
    paymentStatus: "Pending",
    orderStatus: "Pending",
  });

  await order.save();
  cart.products = [];
  await cart.save();

  res.json({ msg: "Order placed successfully", order });
});

module.exports = router;
