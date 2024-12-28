const express = require("express");
const {registerUser,loginUser}=require("../controller/user.controller.js")
const router = express.Router();
const dotenv=require('dotenv')
dotenv.config();



router.post("/register",registerUser )
router.post("/login",loginUser)
module.exports = router;
