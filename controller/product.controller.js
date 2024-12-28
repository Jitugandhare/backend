const Product = require('../models/product.model.js');


const createProduct = async (req, res) => {
    const { name, price, stock, image } = req.body;

    try {
        const newProduct = new Product({ name, price, stock, image });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: 'Error creating product' });
    }
};


const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching products' });
    }
};


const getProductById = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching product' });
    }
};


const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, price, stock, image } = req.body;

    try {
        const product = await Product.findByIdAndUpdate(
            productId,
            { name, price, stock, image },
            { new: true }
        );
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Error updating product' });
    }
};


const deleteProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findByIdAndDelete(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting product' });
    }
};


module.exports = {
    createProduct, getAllProducts, getProductById, updateProduct, deleteProduct
}