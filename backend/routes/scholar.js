const express = require('express');
const router = express.Router();
const Scholar = require('../models/scholar');

// Get all scholars
router.get('/', async (req, res) => {
  try {
    const scholars = await Scholar.find();
    res.json(scholars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a scholar
router.post('/', async (req, res) => {
  const { name, id, year, course, duty } = req.body;
  const newScholar = new Scholar({ name, id, year, course, duty });
  try {
    const saved = await newScholar.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update scholar
router.put('/:id', async (req, res) => {
  try {
    const scholar = await Scholar.findById(req.params.id);
    if (!scholar) return res.status(404).json({ message: 'Scholar not found' });

    Object.assign(scholar, req.body);
    const updated = await scholar.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deactivate/reactivate scholar
router.patch('/:id/status', async (req, res) => {
  try {
    const scholar = await Scholar.findById(req.params.id);
    if (!scholar) return res.status(404).json({ message: 'Scholar not found' });

    scholar.status = req.body.status; // 'active' or 'deactivated'
    const updated = await scholar.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
