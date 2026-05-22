const School = require('../models/schoolModel');
const mongoose = require('mongoose');

// Get all schools
const getAllSchools = async (req, res) => { 
    const schools = await School.find({}).sort({ createdAt: -1 });
    res.status(200).json(schools);
}

// Get single school
const getSchool = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No school with that id'});
    }

    const school = await School.findById(id);

    if(!school){
        return res.status(404).json({error: 'No school with that id'});
    }

    res.status(200).json(school);
}

// Create a school
const createSchool = async (req, res) => {
    const { 
        userID,
        schoolName,
        contact, 
        email, 
        address, 
        website, 
        description 
    } = req.body;

    let emptyFields = [];

    if(!schoolName) emptyFields.push('schoolName');
    if(!contact) emptyFields.push('contact');
    if(!email) emptyFields.push('email');
    if(!userID) emptyFields.push('userID');
    if(!address) emptyFields.push('address');    

    if(emptyFields.length > 0){
        return res.status(400).json({ error: `The following fields are required: ${emptyFields.join(', ')}` });
    }

    // Add to database
    try {
        const school = await School.create({
            userID,
            schoolName,
            contact,
            email,
            address,
            website,
            description
        });
        res.status(200).json(school);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Delete a school
const deleteSchool = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send('No school with that id');
    }

    const school = await School.findByIdAndDelete(id);

    if (!school) {
        return res.status(400).json({ error: 'No school with that id' });
    }

    res.status(200).json(school);
}

// Update a school
const updateSchool = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({ error: 'No school with that id' });
    }

    const school = await School.findOneAndUpdate({ _id: id}, {...req.body}, { new: true });

    if (!school) {
        return res.status(400).json({ error: 'No school with that id' });
    }

    res.status(200).json(school);
}

module.exports = {
    getAllSchools, 
    getSchool,
    createSchool,
    deleteSchool,
    updateSchool
}
