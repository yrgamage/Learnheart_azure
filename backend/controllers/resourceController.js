const Resource = require('../models/resourceModel'); 
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const { get } = require('http');


// Configure Multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/notes'); // PDFs will be stored in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      console.error('File upload error: Invalid file type');
      cb(new Error('Only PDFs are allowed'), false);
    }
  },
}).single('pdf');


// URL validation function (ensures only YouTube & Google Drive links are allowed)
const isValidResourceURL = (url) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/;
  const googleDriveRegex = /^(https?:\/\/)?(drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=)/;

  return youtubeRegex.test(url) || googleDriveRegex.test(url);
};

// Get all resources
const getAllResources = async (req, res) => {
  try {
    const { title, subject, type, grade, sort = "title", order = "asc" } = req.query;

    const query = {};

    if (title) query.title = { $regex: title, $options: "i" }; // Case-insensitive search
    if (subject) query.subject = subject;
    if (type) query.type = type;
    if (grade) query.grade = Number(grade); // Ensure grade is a number

    const sortOption = { [sort]: order === "asc" ? 1 : -1 };

    const resources = await Resource.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Resource.countDocuments(query);

    res.status(200).json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: resources,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching resources", error: err });
  }
};

// Get Notes with Pagination
const getNotes = async (req, res) => {
  try {
    const { page = 1, limit = 3, sort = "title", order = "asc" } = req.query;

    const query = { type: "Note" };
    const sortOption = { [sort]: order === "asc" ? 1 : -1 };

    const notes = await Resource.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Resource.countDocuments(query);

    res.status(200).json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: notes,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching notes", error: err });
  }
};

// Get Videos with Pagination
const getVideos = async (req, res) => {
  try {
    const { page = 1, limit = 3, sort = "title", order = "asc" } = req.query;

    const query = { type: "Seminar video" };
    const sortOption = { [sort]: order === "asc" ? 1 : -1 };

    const videos = await Resource.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Resource.countDocuments(query);

    res.status(200).json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: videos,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching videos", error: err });
  }
};

// Get Notes with Pagination (POST method)
const getNotesWithPaginate = async (req, res) => {
  try {
    const { subject, grade, page = 1, limit = 3, sort = "title", order = "asc" } = req.body;

    const query = { type: "Note" };
    if (subject) query.subject = { $regex: new RegExp(subject, 'i') }; // Case-insensitive search
    if (grade) query.grade = Number(grade);

    const sortOption = { [sort]: order === "asc" ? 1 : -1 };

    const notes = await Resource.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Resource.countDocuments(query);

    res.status(200).json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: notes,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching notes", error: err });
  }
};

// Get Videos with Pagination (POST method)
const getVideosWithPaginate = async (req, res) => {
  try {
    const { subject, grade, page = 1, limit = 3, sort = "title", order = "asc" } = req.body;

    const query = { type: "Seminar video" };
    if (subject) query.subject = { $regex: new RegExp(subject, 'i') }; // Case-insensitive search
    if (grade) query.grade = Number(grade);

    const sortOption = { [sort]: order === "asc" ? 1 : -1 };

    const videos = await Resource.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Resource.countDocuments(query);

    res.status(200).json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: videos,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching videos", error: err });
  }
};

// Add resources
const addResource = async (req, res) => {
  try {
    const { title, grade, type, description, url, subject } = req.body;
    let pdfUrl = null;

    if (req.file) {
      pdfUrl = `${req.protocol}://${req.get('host')}/uploads/notes/${req.file.filename}`;
    }

    // Validate URL if provided
    if (url && !isValidResourceURL(url)) {
      return res.status(400).json({ message: 'Invalid URL. Only YouTube and Google Drive links are allowed.' });
    }

    const resource = new Resource({ title, grade, type, description, url, pdfUrl, subject });
    await resource.save();

    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ message: 'Error adding resource', error: err.message });
  }
};

// Get a resource by ID
const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid resource ID" });
    }

    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.status(200).json(resource);
  } catch (err) {
    res.status(500).json({ message: "Error fetching resource", error: err.message });
  }
};


// Update an existing resource
const updateResource = async (req, res) => {
  try {
    const { url } = req.body;

    if (url && !isValidResourceURL(url)) {
      return res.status(400).json({ message: 'Invalid URL. Only YouTube and Google Drive links are allowed.' });
    }

    const updatedResource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.status(200).json(updatedResource);
  } catch (err) {
    res.status(400).json({ message: 'Error updating resource', error: err });
  }
};

// Delete a resource
const deleteResource = async (req, res) => {
  try {
    const deletedResource = await Resource.findByIdAndDelete(req.params.id);
    if (!deletedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting resource', error: err });
  }
};

module.exports = {
  getAllResources,
  getNotes,
  getVideos,
  getNotesWithPaginate,
  getVideosWithPaginate,
  getResourceById,
  addResource,
  updateResource,
  deleteResource,
  upload,
};