const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


const authMiddleware = (req, res, next) => {
  // Extract the token from the Authorization header (expects 'Bearer <token>')
  const token = req.headers["authorization"]?.split(" ")[1];

  // If no token is provided, respond with 401 Unauthorized
  if (!token) {
    return res.status(401).json({ msg: "Authorization denied. No token provided." });
  }

  try {
    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(decoded)
    // If the token is valid, attach the decoded payload to the request object
    if (decoded) {
      req.user = decoded;
    }

    // Call the next middleware function or route handler
    next();

  } catch (error) {
    // Handle different error cases
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token has expired." });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ msg: "Invalid token." });
    } else {
      // For other errors, return a generic server error
      console.error(error);
      return res.status(500).json({ msg: "Server error." });
    }
  }
};

module.exports = authMiddleware;
