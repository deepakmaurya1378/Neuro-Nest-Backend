const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { trusted } = require("mongoose");

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
   
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ name, email, password, role });
    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1h" });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000, 
      })
      .status(200)
      .json({
        message: "User registered successfully",
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};


const updatePassword = async (req, res) => {
  const { password, newPassword, userId } = req.body;

  try {
  
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    
   
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password); // Assuming User model has a comparePassword method
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1h" });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000, 
      })
      .status(200)
      .json({
        message: "Login successful",
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logged out successfully" });
};

const checkAuth = (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { registerUser, loginUser, logoutUser, checkAuth , updatePassword };
