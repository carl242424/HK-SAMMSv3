const express = require('express');
const router = express.Router();
const Scholar = require('../models/scholar');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Get all scholars
router.get('/', async (req, res) => {
  try {
    const scholars = await Scholar.find().sort({ createdAt: -1 });
    res.json(scholars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new scholar + auto-create user
router.post('/', async (req, res) => {
  const { name, id, email, year, course, duty, password } = req.body;

  if (!name || !id || !email || !year || !course || !duty || !password) {
    return res.status(400).json({ message: "All fields are required (including password)" });
  }

  try {
    // 1️⃣ Create scholar
    const newScholar = new Scholar({ name, id, email, year, course, duty });
    const savedScholar = await newScholar.save();

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10); // use provided password

      const newUser = new User({
        username: id.toString(),
        email,
        password: hashedPassword,
        role: req.body.role || "checker",
      });

      await newUser.save();
      console.log(`✅ User created for ${email} with provided password`);
    }

    res.status(201).json({
      message: "Scholar added and user created successfully",
      scholar: savedScholar,
    });
  } catch (err) {
    console.error("❌ Error saving scholar:", err);
    res.status(500).json({ message: err.message });
  }
});
// Update scholar + update user
router.put('/:id', async (req, res) => {
  try {
    const scholar = await Scholar.findById(req.params.id);
    if (!scholar) return res.status(404).json({ message: 'Scholar not found' });

    // Save old scholar data
    const oldId = scholar.id;
    const oldEmail = scholar.email;

    // Update scholar fields
    Object.assign(scholar, req.body);
    const updatedScholar = await scholar.save();

    // ✅ Find the corresponding user by username (ID)
    const user = await User.findOne({ username: oldId.toString() });

    if (user) {
      console.log("🟡 Found user to update:", user.email);

      // Update user fields
      user.username = req.body.id?.toString() || user.username;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;

      // Optional: if password provided, hash and update
      if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
      }

      await user.save();
      console.log("✅ User updated successfully:", user);
    } else {
      console.log("⚠️ No user found for scholar ID:", oldId);
    }

    res.json({
      message: 'Scholar and linked user updated successfully',
      scholar: updatedScholar,
    });
  } catch (err) {
    console.error('❌ Error updating scholar and user:', err);
    res.status(400).json({ message: err.message });
  }
});

// ✅ Toggle scholar + linked user status
router.patch('/:id/status', async (req, res) => {
  try {
    // Find scholar by MongoDB ID
    const scholar = await Scholar.findById(req.params.id);

    if (!scholar) {
      return res.status(404).json({ message: 'Scholar not found' });
    }

    // Toggle scholar status (Active ↔ Inactive)
    scholar.status =
      scholar.status.toLowerCase() === 'active' ? 'Inactive' : 'Active';
    await scholar.save();
    console.log('✅ Scholar status updated:', scholar.status);

    // Find linked user (based on scholar.id = user.username)
    const user = await User.findOne({ username: scholar.id.toString() });
    if (user) {
      user.status = scholar.status; // mirror scholar’s status
      await user.save();
      console.log(`✅ User status updated for ${user.username}: ${user.status}`);

      // Send email if account is deactivated
      if (scholar.status.toLowerCase() === 'inactive') {
        await transporter.sendMail({
          from: EMAIL_USER,
          to: user.email,
          subject: 'Account Deactivated',
          text: `Hello ${user.username},\n\nYour account has been deactivated by admin. You will not be able to login until reactivated.`,
        });
        console.log(`📧 Deactivation email sent to ${user.email}`);
      }
    } else {
      console.log(`⚠️ No linked user found for scholar ID: ${scholar.id}`);
    }

    res.json({
      message: 'Status updated successfully',
      scholar,
    });
  } catch (error) {
    console.error('❌ Error updating scholar status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;