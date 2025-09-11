const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    if (!header || !header.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Missing or invalid token header" });
    }

    const token = header.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error("Token check error:", err);
    return res
      .status(500)
      .json({ message: "Server error during token verification" });
  }
};

module.exports = authMiddleware;
