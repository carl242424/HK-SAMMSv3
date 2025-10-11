const express = require('express');
const router = express.Router();
const Scholar = require('../models/scholar');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const { EMAIL_USER, EMAIL_PASS } = process.env;

// ✅ Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Check transporter connection (optional)
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter connection failed:', error);
  } else {
    console.log('✅ Email transporter ready');
  }
});

// ✅ Get all scholars
router.get('/', async (req, res) => {
  try {
    const scholars = await Scholar.find().sort({ createdAt: -1 });
    res.json(scholars);
  } catch (err) {
    console.error('❌ Error fetching scholars:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add new scholar + auto-create user + send welcome email
router.post('/', async (req, res) => {
  const { name, id, email, year, course, duty, password } = req.body;

  if (!name || !id || !email || !year || !course || !duty || !password) {
    return res
      .status(400)
      .json({ message: 'All fields are required (including password)' });
  }

  try {
    // 1️⃣ Create scholar
    const newScholar = new Scholar({ name, id, email, year, course, duty });
    const savedScholar = await newScholar.save();

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username: id.toString(),
        email,
        password: hashedPassword,
        role: req.body.role || 'checker',
        status: 'Active',
      });

      await newUser.save();
      console.log(`✅ User created for ${email} with provided password`);

      // 3️⃣ Send welcome email
      try {
        await transporter.sendMail({
          from: EMAIL_USER,
          to: email,
          subject: 'Account Created - HK-SAMMS',
          text: `Hello ${name},\n\nYour account has been successfully created.\n\nUsername: ${id}\nPlease use your registered password to log in.\n\nWelcome aboard!\n\n— HK-SAMMS Team`,
        });
        console.log(`📧 Welcome email sent to ${email}`);
      } catch (emailErr) {
        console.error(`❌ Failed to send welcome email to ${email}:`, emailErr);
      }
    }

    res.status(201).json({
      message: 'Scholar added and user created successfully',
      scholar: savedScholar,
    });
  } catch (err) {
    console.error('❌ Error saving scholar:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update scholar + update user
router.put('/:id', async (req, res) => {
  try {
    const scholar = await Scholar.findById(req.params.id);
    if (!scholar) return res.status(404).json({ message: 'Scholar not found' });

    const oldId = scholar.id;
    Object.assign(scholar, req.body);
    const updatedScholar = await scholar.save();

    const user = await User.findOne({ username: oldId.toString() });

    if (user) {
      user.username = req.body.id?.toString() || user.username;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;

      if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
      }

      await user.save();
      console.log(`✅ User updated successfully for ${user.email}`);
    } else {
      console.log(`⚠️ No user found for scholar ID: ${oldId}`);
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

// ✅ Toggle scholar + linked user status + send email notifications
router.patch('/:id/status', async (req, res) => {
  try {
    const scholar = await Scholar.findById(req.params.id);
    if (!scholar) {
      return res.status(404).json({ message: 'Scholar not found' });
    }

    const previousStatus = scholar.status;
    const newStatus = scholar.status === 'Active' ? 'Inactive' : 'Active';

    scholar.status = newStatus;
    await scholar.save();
    console.log(`✅ Scholar status updated: ${newStatus}`);

    const user = await User.findOne({ username: scholar.id.toString() });
    if (user) {
      user.status = newStatus;
      await user.save();
      console.log(`✅ User status updated for ${user.username}: ${newStatus}`);

      try {
        if (newStatus === 'Inactive') {
          await transporter.sendMail({
            from: EMAIL_USER,
            to: user.email,
            subject: 'Account Deactivated - HK-SAMMS',
            text: `Hello ${user.username},\n\nYour account has been deactivated by the admin.\nYou will not be able to log in until it is reactivated.\n\n— HK-SAMMS Team`,
          });
          console.log(`📧 Deactivation email sent to ${user.email}`);
        } else if (previousStatus === 'Inactive' && newStatus === 'Active') {
          await transporter.sendMail({
            from: EMAIL_USER,
            to: user.email,
            subject: 'Account Reactivated - HK-SAMMS',
            text: `Hello ${user.username},\n\nGood news! Your account has been reactivated by the admin.\nYou may now log in again.\n\nWelcome back!\n\n— HK-SAMMS Team`,
          });
          console.log(`📬 Reactivation email sent to ${user.email}`);
        }
      } catch (emailErr) {
        console.error(`❌ Failed to send status email:`, emailErr);
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
