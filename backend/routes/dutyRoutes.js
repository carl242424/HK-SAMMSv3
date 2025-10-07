const express = require("express");
const router = express.Router();
const Duty = require("../models/duty");

// 📌 GET all duties
router.get("/", async (req, res) => {
  try {
    const duties = await Duty.find();
    res.json(duties);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 POST create a new duty
router.post("/", async (req, res) => {
  try {
    const duty = new Duty(req.body);
    await duty.save();
    res.status(201).json(duty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 📌 PUT update an existing duty
router.put("/:id", async (req, res) => {
  try {
    const updated = await Duty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Update failed" });
  }
});

// 📌 DELETE a duty
router.delete("/:id", async (req, res) => {
  try {
    await Duty.findByIdAndDelete(req.params.id);
    res.json({ message: "Duty deleted" });
  } catch (error) {
    res.status(400).json({ message: "Delete failed" });
  }
});

module.exports = router;
