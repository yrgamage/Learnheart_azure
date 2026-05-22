const Seminar = require('../models/seminarModel');
const mongoose = require('mongoose');

const getAllSeminars = async (req, res) => {
    const seminars = await Seminar.find({}).sort({ createdAt: -1 });
    res.status(200).json(seminars);
};

const getUpcomingSeminars = async (req, res) => {
    const today = new Date();
    const seminars = await Seminar.find({ expDate: { $gte: today } }).sort({ expDate: 'asc' });
    res.status(200).json(seminars);
};

const getPastSeminars = async (req, res) => {
    const today = new Date();
    const seminars = await Seminar.find({ expDate: { $lt: today } }).sort({ expDate: 'desc' });
    res.status(200).json(seminars);
};

const getSeminar = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No seminar with that id" });
    }

    const seminar = await Seminar.findById(id);

    if (!seminar) {
        return res.status(404).json({ error: "No seminar with that id" });
    }

    res.status(200).json(seminar);
};

const createSeminar = async (req, res) => {
    const {
        name,
        description,
        rating,
        location,
        phoneNumber,
        status,
        subject,
        grade,
        medium,
        expStudentCount,
        expTeacherCount,
        additionalRequests,
        expDate,
        schoolId,
        organization,
        organizationId
    } = req.body;
    
    // const schoolId = req.session.userid;// Get userId from Clerk session


    // if (!userId) {
    //     return res.status(401).json({ error: "User not authenticated" }); // Unauthorized if no userId in session
    // }



    try {
        const seminar = await Seminar.create({
            name,
            description,
            rating,
            location,
            phoneNumber,
            status,
            subject,
            grade,
            medium,
            expStudentCount,
            expTeacherCount,
            additionalRequests,
            expDate,
            schoolId,// Associate the seminar with the authenticated user
            organization,
            organizationId
        });

        res.status(200).json(seminar);
        console.log("Seminar created successfully"+seminar);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteSeminar = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No seminar with that id' });
    }

    const seminar = await Seminar.findOneAndDelete({ _id: id });

    if (!seminar) {
        return res.status(400).json({ error: 'No seminar with that id' });
    }

    res.status(200).json(seminar);
};

const updateSeminar = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No seminar with that id' });
    }

    const seminar = await Seminar.findOneAndUpdate({ _id: id }, { ...req.body });

    if (!seminar) {
        return res.status(400).json({ error: 'No seminar with that id' });
    }

    res.status(200).json(seminar);
};

module.exports = {
    getAllSeminars,
    getSeminar,
    createSeminar,
    deleteSeminar,
    updateSeminar,
    getUpcomingSeminars,
    getPastSeminars
};
