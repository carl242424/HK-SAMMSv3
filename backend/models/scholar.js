const mongoose = require('mongoose');

const scholarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  year: { type: String, required: true },
  course: { type: String, required: true },
  duty: { type: String, required: true },
  remainingHours: { type: Number, default: 70 },
  status: { type: String, default: 'Active' } // ✅ match frontend
}, { collection: 'scholars', timestamps: true }); // ✅ keep timestamps

module.exports = mongoose.model('Scholar', scholarSchema);
