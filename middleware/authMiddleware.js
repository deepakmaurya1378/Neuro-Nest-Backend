const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const jwtSecret = process.env.jwtSecret;

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;  
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
