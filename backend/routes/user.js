
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose"); // Add mongoose at the top
console.log("✅ user.js routes loaded");
// Authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.error("No token provided in Authorization header");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded); // Log decoded token for debugging
    req.user = decoded; // Sets req.user with { _id: "user_id_here" }
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Fetch logged-in user's profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    console.log("Fetching profile for userId:", req.user._id);
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      console.error("User not found for userId:", req.user._id);
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Returning profile:", user);
    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});
// Fetch all admin users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({ role: "admin" }).select('_id employeeId username email role status');
    console.log("Raw users from DB:", users);
    const formattedUsers = users.map(u => ({
      _id: u._id,
      employeeId: u.employeeId,
      username: u.username,
      email: u.email,
      role: u.role,
      status: u.status
    }));
    console.log("Returning users:", formattedUsers);
    res.status(200).json(formattedUsers);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, employeeId, password, email, role, status } = req.body;
    console.log("Received data:", req.body);

    if (!username || !password || !email || !role || !employeeId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (role !== "admin") {
      return res.status(400).json({ message: "Role must be 'admin'" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      employeeId,
      password: hashedPassword,
      email,
      role,
      status: status || "Active",
    });

    const savedUser = await newUser.save();
    console.log("Saved user:", savedUser);

    res.status(201).json({
      _id: savedUser._id,
      employeeId: savedUser.employeeId,
      username: savedUser.username,
      email: savedUser.email,
      role: savedUser.role,
      status: savedUser.status
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Failed to create user" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    console.log("Update data for id:", id, updates); // Debug log

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      _id: updatedUser._id,
      employeeId: updatedUser.employeeId,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: err.message || "Failed to update user" });
  }
});


module.exports = router;
