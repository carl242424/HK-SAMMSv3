const express = require('express');
const router = express.Router();
const FaciAttendance = require('../models/FaciAttendance');

router.get('/', async (req, res) => {
  try {
    const query = req.query.studentId ? { studentId: req.query.studentId } : {};
    console.log('Attendance query:', query);
    const records = await FaciAttendance.find();
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching records', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const query = req.query.studentId ? { studentId: req.query.studentId } : {};
    const newRecord = new FaciAttendance(req.body);
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(400).json({ message: 'Error saving record', error });
  }
});

module.exports = router;