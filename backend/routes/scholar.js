const express = require('express');
const router = express.Router();
const Scholar = require('../models/scholar');

// Get all scholars
router.get('/', async (req, res) => {
  try {
    const scholars = await Scholar.find().sort({ createdAt: -1 }); // newest first
    res.json(scholars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new scholar
router.post('/', async (req, res) => {
  const { name, id, email, year, course, duty } = req.body;

  if (!name || !id || !email || !year || !course || !duty) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newScholar = new Scholar({ name, id, email, year, course, duty });
    const savedScholar = await newScholar.save();
    res.status(201).json(savedScholar);
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
    const updatedScholar = await scholar.save();
    res.json(updatedScholar);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Toggle status (activate/deactivate)
router.patch('/:id/status', async (req, res) => {
  try {
    const scholar = await Scholar.findById(req.params.id);
    if (!scholar) return res.status(404).json({ message: 'Scholar not found' });

    const { status } = req.body;
    if (!["active", "deactivated"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    scholar.status = status;
    const updatedScholar = await scholar.save();
    res.json(updatedScholar);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
