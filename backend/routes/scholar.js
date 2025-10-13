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

// Check transporter connection
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
    res.status(500).json({ message: 'Failed to fetch scholars', error: err.message });
  }
});

// ✅ Add new scholar + auto-create user + send welcome email
router.post('/', async (req, res) => {
  const { name, id, email, year, course, duty, password, role } = req.body;

  console.log('📥 Received POST request with body:', req.body);

  if (!name || !id || !email || !year || !course || !duty || !password) {
    console.error('❌ Missing required fields:', { name, id, email, year, course, duty, password });
    return res.status(400).json({ message: 'All fields are required (name, id, email, year, course, duty, password)' });
  }

  // Validate role
  const validRoles = ['admin', 'checker', 'facilitator'];
  const userRole = role && validRoles.includes(role) ? role : 'checker';

  try {
    // 1️⃣ Check if scholar already exists
    const existingScholar = await Scholar.findOne({ $or: [{ id }, { email }] });
    if (existingScholar) {
      console.error('❌ Scholar already exists with ID or email:', { id, email });
      return res.status(400).json({ message: 'Scholar with this ID or email already exists' });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username: id }, { employeeId: id }] });
    if (existingUser) {
      console.error('❌ User already exists with email, username, or employeeId:', { email, id });
      return res.status(400).json({ message: 'User with this email or ID already exists' });
    }

    // 3️⃣ Create scholar
    const newScholar = new Scholar({ name, id, email, year, course, duty, status: 'Active' });
    const savedScholar = await newScholar.save();
    console.log('✅ Scholar created:', savedScholar);

    // 4️⃣ Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: id.toString(),
      employeeId: userRole === 'admin' ? id.toString() : undefined, // ✅ null for checker/facilitator
      email,
      password: hashedPassword,
      role: userRole,
      status: 'Active',
    });

    await newUser.save();
    console.log(`✅ User created for ${email} with username: ${id}, role: ${userRole}, employeeId: ${newUser.employeeId}`);

    // 5️⃣ Send welcome email
    try {
      await transporter.sendMail({
        from: `"HK-SAMMS" <${EMAIL_USER}>`,
        to: email,
        subject: 'Account Created - HK-SAMMS',
        text: `Hello ${name},\n\nYour account has been successfully created.\n\nUsername: ${id}\nPlease use your registered password to log in.\n\nWelcome aboard!\n\n— HK-SAMMS Team`,
      });
      console.log(`📧 Welcome email sent to ${email}`);
    } catch (emailErr) {
      console.error(`❌ Failed to send welcome email to ${email}:`, emailErr);
    }

    res.status(201).json({
      message: 'Scholar and user created successfully',
      scholar: savedScholar,
    });
  } catch (err) {
    console.error('❌ Error in POST /scholars:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate ID or email detected', error: err.message });
    }
    res.status(500).json({ message: 'Failed to create scholar or user', error: err.message });
  }
});

// ✅ Update scholar + update user
router.put('/:id', async (req, res) => {
  try {
    const scholar = await Scholar.findById(req.params.id);
    if (!scholar) {
      console.error('❌ Scholar not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Scholar not found' });
    }

    const oldId = scholar.id;
    Object.assign(scholar, req.body);
    const updatedScholar = await scholar.save();
    console.log('✅ Scholar updated:', updatedScholar);

    const user = await User.findOne({ username: oldId.toString() });

    if (user) {
      user.username = req.body.id?.toString() || user.username;
      user.employeeId = req.body.role === 'admin' ? req.body.id?.toString() || user.employeeId : null; // ✅ null for checker/facilitator
      user.email = req.body.email || user.email;
      user.role = req.body.role && ['admin', 'checker', 'facilitator'].includes(req.body.role) ? req.body.role : user.role;

      if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
      }

      await user.save();
      console.log(`✅ User updated for ${user.email}, role: ${user.role}, employeeId: ${user.employeeId}`);
    } else if (req.body.email && req.body.id && req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username: req.body.id.toString(),
        employeeId: req.body.role === 'admin' ? req.body.id.toString() : null, // ✅ null for checker/facilitator
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role && ['admin', 'checker', 'facilitator'].includes(req.body.role) ? req.body.role : 'checker',
        status: scholar.status || 'Active',
      });
      await newUser.save();
      console.log(`✅ New user created during update for ${req.body.email}, role: ${newUser.role}, employeeId: ${newUser.employeeId}`);
    } else {
      console.log(`⚠️ No user found for scholar ID: ${oldId}, and insufficient data to create new user`);
    }

    res.json({
      message: 'Scholar and linked user updated successfully',
      scholar: updatedScholar,
    });
  } catch (err) {
    console.error('❌ Error updating scholar and user:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate ID or email detected during update', error: err.message });
    }
    res.status(400).json({ message: 'Failed to update scholar or user', error: err.message });
  }
});

// ✅ Toggle scholar + linked user status + send email notifications
router.patch('/:id/status', async (req, res) => {
  try {
    const scholar = await Scholar.findById(req.params.id);
    if (!scholar) {
      console.error('❌ Scholar not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Scholar not found' });
    }

    const previousStatus = scholar.status;
    const newStatus = scholar.status === 'Active' ? 'Inactive' : 'Active';

    scholar.status = newStatus;
    await scholar.save();
    console.log(`✅ Scholar status updated to ${newStatus} for ID: ${scholar.id}`);

    const user = await User.findOne({ username: scholar.id.toString() });
    if (user) {
      user.status = newStatus;
      await user.save();
      console.log(`✅ User status updated for ${user.username}: ${newStatus}`);

      try {
        if (newStatus === 'Inactive') {
          await transporter.sendMail({
            from: `"HK-SAMMS" <${EMAIL_USER}>`,
            to: user.email,
            subject: 'Account Deactivated - HK-SAMMS',
            text: `Hello ${user.username},\n\nYour account has been deactivated by the admin.\nYou will not be able to log in until it is reactivated.\n\n— HK-SAMMS Team`,
          });
          console.log(`📧 Deactivation email sent to ${user.email}`);
        } else if (previousStatus === 'Inactive' && newStatus === 'Active') {
          await transporter.sendMail({
            from: `"HK-SAMMS" <${EMAIL_USER}>`,
            to: user.email,
            subject: 'Account Reactivated - HK-SAMMS',
            text: `Hello ${user.username},\n\nGood news! Your account has been reactivated by the admin.\nYou may now log in again.\n\nWelcome back!\n\n— HK-SAMMS Team`,
          });
          console.log(`📬 Reactivation email sent to ${user.email}`);
        }
      } catch (emailErr) {
        console.error(`❌ Failed to send status email to ${user.email}:`, emailErr);
      }
    } else {
      console.error(`❌ No linked user found for scholar ID: ${scholar.id}. Cannot create user without a password.`);
      return res.status(400).json({
        message: 'No linked user found for scholar. Please update the scholar with a password to create a user.',
      });
    }

    res.json({
      message: 'Status updated successfully',
      scholar,
    });
  } catch (err) {
    console.error('❌ Error updating scholar status:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate ID or email detected during status update', error: err.message });
    }
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
});

// ✅ Get a single scholar by student ID (custom field `id`)
router.get('/:id', async (req, res) => {
  try {
    const scholar = await Scholar.findOne({ id: req.params.id });
    if (scholar) {
      res.json({ exists: true, scholar });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error('❌ Error fetching scholar by ID:', err);
    res.status(500).json({ message: 'Failed to fetch scholar', error: err.message });
  }
});

module.exports = router;