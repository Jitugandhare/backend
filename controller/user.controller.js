const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const dotenv = require('dotenv');
dotenv.config();

// Regular expression for valid email (only Gmail and Yahoo)
const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;

// Register user function
const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;

    // Validate fields
    if (!fullName || !email || !password) {
        return res.status(400).json({ msg: "Please provide all fields" });
    }

    // Validate email
    if (!emailRegex.test(email)) {
        return res.status(400).json({ msg: "Please provide a valid email address." });
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        // Save user to database
        await newUser.save();
        return res.status(201).json({ msg: "User created successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error. Please try again later." });
    }
}

// Login user function
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
        return res.status(400).json({ msg: "Please provide email and password" });
    }

    // Validate email
    if (!emailRegex.test(email)) {
        return res.status(400).json({ msg: "Please provide a valid email address." });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Check password match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Create payload for JWT (including _id for more security)
        const payload = { userId: user._id.toString() };

        // Sign the JWT token with expiration of 1 hour
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);


        // Return response with token
        return res.json({ msg: "User successfully logged in", token, user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error. Please try again later." });
    }
}

module.exports = { registerUser, loginUser };
