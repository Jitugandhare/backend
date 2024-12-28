const Cart = require("../models/cart.model.js");
const Product = require("../models/product.model.js");
const authMiddleware = require("../middleware/auth.middleware.js");


// Add product to cart
const addToCart = async (req, res) => {

  // console.log("Request Body:", req.body);

  const { productId, quantity } = req.body.products[0];


  // console.log("productId:", productId);
  // console.log("quantity:", quantity);

  try {

    if (quantity <= 0 || isNaN(quantity)) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const product = await Product.findById(productId);


    // console.log('Found product:', product);


    if (!product) {
      return res.status(400).json({ message: 'Product not available' });
    }


    // console.log('Product stock:', product.stock);


    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }


    let cart = await Cart.findOne({ userId: req.user.userId });


    if (!cart) {
      cart = new Cart({ userId: req.user.userId, products: [] });
    }


    const existingProductIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );


    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {

      cart.products.push({ productId, quantity });
    }


    await cart.save();


    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (err) {

    console.error('Error adding to cart:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get cart items

const getCartItems = async (req, res) => {
  const userId = req.user?.userId;
  console.log("userID:-", userId);

  try {
    // Fetch the cart items for the user
    const cartItems = await Cart.find({ userId });

    if (!cartItems.length) {
      return res.status(404).json({ message: 'No cart items found for the user.' });
    }

    // Process the products to fetch their details and merge with quantity
    const enrichedCartItems = await Promise.all(
      cartItems.map(async (cart) => {
        const products = await Promise.all(
          cart.products.map(async (product) => {
            const productData = await Product.findById(product.productId); // Replace `Product` with your product model
            return {
              ...productData.toObject(),
              quantity: product.quantity,
            };
          })
        );

        return {
          userId: cart.userId,
          products,
        };
      })
    );

    console.log(`Enriched Cart Items:`, enrichedCartItems);
    res.status(200).json(enrichedCartItems);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error fetching cart items' });
  }
};


// Remove product from cart
const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(400).json({ message: 'Cart not found' });
    }

    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addToCart, getCartItems, removeFromCart };
