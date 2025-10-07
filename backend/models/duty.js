const mongoose = require("mongoose");

const dutySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Scholar name
  id: { type: String, required: true }, // Student ID
  course: { type: String, required: true },
  year: { type: String, required: true },
  dutyType: { type: String, required: true },
  day: { type: String, required: true },
  time: { type: String, required: true },
  room: { type: String, required: true },
  status: { type: String, default: "Active" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Duty", dutySchema);
