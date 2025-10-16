const express = require('express');
const router = express.Router();
const CheckerAttendance = require('../models/checkerAttendance');

router.get('/', async (req, res) => {
  try {
    const records = await CheckerAttendance.find();
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching records', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const newRecord = new CheckerAttendance(req.body);
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(400).json({ message: 'Error saving record', error });
  }
});

module.exports = router;