const express = require("express");
const authMiddleware = require("../middleware/auth.middleware.js");
const {getCartItems,addToCart,removeFromCart}=require("../controller/cart.controller.js")
const router = express.Router();



router.get("/", authMiddleware,getCartItems);
router.post("/add", authMiddleware,addToCart);
router.delete("/remove/:productId",removeFromCart)

module.exports = router;
