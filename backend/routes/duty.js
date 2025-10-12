const express = require("express");
const router = express.Router();
const Duty = require("../models/duty");

// Get all duties
router.get('/', async (req, res) => {
  try {
    const duties = await Duty.find();
    console.log('Fetched duties from database:', duties);
    res.json(duties);
  } catch (err) {
    console.error('❌ Error fetching duties:', err);
    res.status(500).json({ message: err.message });
  }
});
// Add new duty
router.post('/', async (req, res) => {
  console.log("POST received duty:", req.body); // MUST appear in terminal
  const duty = new Duty(req.body);
  const savedDuty = await duty.save();
  console.log("Duty saved:", savedDuty);
  res.status(201).json(savedDuty);
});

// Update duty
router.put("/:id", async (req, res) => {
  try {
    const updatedDuty = await Duty.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDuty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete duty
router.delete("/:id", async (req, res) => {
  try {
    await Duty.findByIdAndDelete(req.params.id);
    res.json({ message: "Duty deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;