const Volunteer = require("../models/volunteerModel");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const VolunteerRequest = require("../models/volunteerRequestModel");
const Organization = require("../models/organizationModel"); 

//get all volunteers
const getAllVolunteers = async (req, res) => {
  const volunteers = await Volunteer.find({}).sort({ createdAt: -1 });
  res.status(200).json(volunteers);
};

//get single volunteer
const getVolunteer = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such volunteer with that id" });
  }

  const volunteer = await Volunteer.findById(id);

  if (!volunteer) {
    return res.status(404).json({ error: "No such volunteer with that id" });
  }

  res.status(200).json(volunteer);
};

//create a volunteer
const createVolunteer = async (req, res) => {
  const {
    userID,
    name,
    description,
    volunteerId,
    status,
    address,
    phoneNumber,  // Added phoneNumber
    skills,
    email,
    volunteerProfileImageAvailable,
    volunteerProfileColor,
    orgID
  } = req.body;

  let emptyFields = [];

  if (!name || !name.trim()) {
    emptyFields.push("name");
  }

  if (!description) {
    emptyFields.push("description");
  }

  if (!phoneNumber || !phoneNumber.trim()) {  // Check if phoneNumber is provided
    emptyFields.push("phoneNumber");
  }

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: `The following fields are required`, emptyFields });
  }

  //add to database
  try {
    const volunteer = await Volunteer.create({
      userID,
      name,
      description,
      volunteerId,
      status,
      address,
      phoneNumber,  // Added phoneNumber to database creation
      skills,
      email,
      volunteerProfileImageAvailable,
      volunteerProfileColor,
      orgID
    });
    res.status(200).json(volunteer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//update a volunteer
const updateVolunteer = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No volunteer with that id" });
  }

  const volunteer = await Volunteer.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
      // Ensure phoneNumber is included if it exists in the request body
    },
    { new: true }  // Ensures the updated volunteer is returned
  );

  if (!volunteer) {
    return res.status(400).json({ error: "No volunteer with that id" });
  }

  res.status(200).json(volunteer);
};

//delete a volunteer
const deleteVolunteer = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No volunteer with that id" });
  }

  const volunteer = await Volunteer.findOneAndDelete({ _id: id });

  if (!volunteer) {
    return res.status(400).json({ error: "No volunteer with that id" });
  }

  res.status(200).json(volunteer);
};

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cvs");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Handle volunteer request creation
const createVolunteerRequest = async (req, res) => {
  try {
    const { qualifications, language, subjects, organization, availableDates } = req.body;
    const cvPath = req.file ? req.file.path : null;

    if (!qualifications || !language || !subjects || !organization || !availableDates || !cvPath) {
      if (cvPath) {
        fs.unlinkSync(cvPath); // Delete the uploaded file
      }
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(organization)) {
      if (cvPath) {
        fs.unlinkSync(cvPath); // Delete the uploaded file
      }
      return res.status(400).json({ error: "Invalid organization ID" });
    }

    const newRequest = new VolunteerRequest({
      qualifications,
      language,
      subjects,
      organization,
      availableDates: JSON.parse(availableDates),
      cv: cvPath,
      userId: req.body.userId,
    });

    await newRequest.save();
    res.status(201).json({ message: "Volunteer request submitted successfully" });
  } catch (error) {
    console.error("Error creating volunteer request:", error);
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path); // Delete the uploaded file
    }
    res.status(500).json({ error: error.message });
  }
};

const getVolunteerRequests = async (req, res) => {
  const { isPending, organizationId } = req.body;

  if (isPending === undefined || !organizationId) {
    return res.status(400).json({ error: "isPending and organizationId are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(organizationId)) {
    return res.status(400).json({ error: "Invalid organization ID" });
  }

  try {
    const volunteerRequests = await VolunteerRequest.aggregate([
      {
        $match: {
          isPending: isPending,
          organization: new mongoose.Types.ObjectId(organizationId), // Fixed with `new`
        },
      },
      {
        $lookup: {
          from: "volunteers",
          localField: "userId",
          foreignField: "volunteerId",
          as: "volunteerDetails",
        },
      },
      { $unwind: "$volunteerDetails" },
    ]);

    res.status(200).json(volunteerRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVolunteerRequestsByUserId = async (req, res) => {
  const { userId, isClosed } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  if (isClosed === undefined) {
    return res.status(400).json({ error: "isClosed is required" });
  }

  try {
    const volunteerRequests = await VolunteerRequest.aggregate([
      {
        $match: { userId: userId, isClosed: isClosed },
      },
      {
        $lookup: {
          from: "organizations",
          localField: "organization",
          foreignField: "_id",
          as: "organizationDetails",
        },
      },
      { $unwind: "$organizationDetails" },
    ]);

    res.status(200).json(volunteerRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const closeVolunteerRequest = async (req, res) => {
  const { requestId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    return res.status(400).json({ error: "Invalid request ID" });
  }

  try {
    await VolunteerRequest.findByIdAndUpdate(requestId, { isClosed: true });
    res.status(200).json({ message: "Volunteer request closed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Accept volunteer request
const acceptVolunteerRequest = async (req, res) => {
  const { requestId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    return res.status(400).json({ error: "Invalid request ID" });
  }

  try {
    await VolunteerRequest.findByIdAndUpdate(requestId, {
      isRejected: false, // Set isRejected to false
      isAccepted: true,  // Set isAccepted to true
      isPending: false   // Set isPending to false
    });
    res.status(200).json({ message: "Volunteer request accepted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Reject volunteer request
const rejectVolunteerRequest = async (req, res) => {
  const { requestId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    return res.status(400).json({ error: "Invalid request ID" });
  }

  try {
    await VolunteerRequest.findByIdAndUpdate(requestId, {
      isRejected: true,  // Set isRejected to true
      isAccepted: false, // Set isAccepted to false
      isPending: false   // Set isPending to false
    });
    res.status(200).json({ message: "Volunteer request rejected" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAcceptedOrganizationsForVolunteer = async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed as a route parameter

  try {
    // Get all accepted requests for the volunteer
    const acceptedRequests = await VolunteerRequest.find({
      userId: userId,
      isAccepted: true
    }).select("organization"); // Only fetch organization field

    // Extract organization IDs
    const organizationIds = acceptedRequests.map(req => req.organization);

    // Get organization names
    const organizations = await Organization.find({ _id: { $in: organizationIds } }).select("name");

    // Return the organization names
    res.status(200).json(organizations.map(org => org.name));
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllVolunteers,
  getVolunteer,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  createVolunteerRequest,
  getVolunteerRequests,
  getVolunteerRequestsByUserId,
  closeVolunteerRequest,
  acceptVolunteerRequest,
  rejectVolunteerRequest,
  getAcceptedOrganizationsForVolunteer,
  upload,
};
