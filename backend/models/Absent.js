// models/Absent.js
const mongoose = require('mongoose');

const absentSchema = new mongoose.Schema({
  studentId: { type: String, required: true },   // same as username
  date:      { type: Date,   required: true },   // date of the absent duty
  dutyId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Duty' },
  createdAt: { type: Date,   default: Date.now },
});

module.exports = mongoose.model('Absent', absentSchema);