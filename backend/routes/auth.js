const express = require('express');
const router = express.Router();
const User = require('../models/user');


// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    let { username, password } = req.body;

    // Ensure username and password exist
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Normalize inputs
    username = username.trim();
    password = password.trim();

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Compare password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Success
    return res.status(200).json({
      message: 'Login successful',
      user: { username: user.username },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
