const express = require("express");
const cors = require("cors");
const dotenv=require('dotenv')
const connection=require('./db/db.js')
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth.js");
const cartRoutes = require("./routes/cart.js");
const orderRoutes = require("./routes/order.js");
const productRoutes=require("./routes/product.route.js")
dotenv.config();
const app = express();
app.use(express.urlencoded({extended:true}))

// cors 

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/product",productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);



app.listen(process.env.PORT, async () => {
  try {
      await connection
      console.log("connected to db")
      console.log(`server is running on port ${process.env.PORT}`)
      

  } catch (error) {
      console.log("Error connecting to DB:", error);
  }

})