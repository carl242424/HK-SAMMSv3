const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const users = await User.find({ role: "admin" }).select('_id employeeId username email role status'); // Explicitly select fields
    console.log("Raw users from DB:", users); // Debug log to check raw data
    const formattedUsers = users.map(u => ({
      _id: u._id, // Use _id as per MongoDB
      employeeId: u.employeeId, // Ensure employeeId is included
      username: u.username,
      email: u.email,
      role: u.role,
      status: u.status
    }));
    console.log("Returning users:", formattedUsers); // Debug log
    res.status(200).json(formattedUsers);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, employeeId, password, email, role, status } = req.body;
    console.log("Received data:", req.body); // Debug log

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
    console.log("Saved user:", savedUser); // Debug log

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
    console.log("Update data:", updates); // Debug log

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
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
    res.status(500).json({ message: "Failed to update user" });
  }
});

module.exports = router;