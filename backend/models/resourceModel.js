const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  grade: { type: Number, required: true },
  type: { type: String, required: true }, // e.g., "Notes", "Seminar videos"
  description: { type: String },
  url: { type: String }, // For YouTube or Google Drive videos
  pdfUrl: { type: String}, // New field for storing uploaded PDFs
  subject: { type: String, required: true },
});

module.exports = mongoose.model('Resource', resourceSchema);

