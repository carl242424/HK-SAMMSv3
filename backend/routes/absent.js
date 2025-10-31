// routes/absent.js
const express = require('express');
const router = express.Router();
const Absent = require('../models/Absent');

// GET absent count
router.get('/', async (req, res) => {
  try {
    const { studentId } = req.query;
    if (!studentId) return res.status(400).json({ message: 'studentId required' });

    const count = await Absent.countDocuments({ studentId });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST to record absent (no reason)
router.post('/', async (req, res) => {
  try {
    const { studentId, date, dutyId } = req.body;
    if (!studentId || !date) {
      return res.status(400).json({ message: 'studentId and date are required' });
    }

    const absent = new Absent({ studentId, date, dutyId });
    await absent.save();
    res.status(201).json(absent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;