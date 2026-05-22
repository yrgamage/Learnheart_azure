const Organization = require('../models/organizationModel');
const mongoose = require('mongoose');

const getAllOrganizations = async (req, res) => {
    const organizations = await Organization.find({}).sort({createdAt: -1});
    setTimeout(() => {
        console.log(organizations);
        res.status(200).json(organizations);
    }, 2000);
};

const getOrganization = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such organization with that id'});
    }

    const organization = await Organization.findById(id);

    if(!organization){
        return res.status(404).json({error: 'No such organization'});
    }

    res.status(200).json(organization);
};

const createOrganization = async (req, res) => {
    const {
        orgID,
        name,
        description,
        phone,
        email,
        website,
        userID,
        profilePic,
        seminarLocations
    } = req.body;
    let emptyFields = [];

    if (!name) {
        emptyFields.push('name');
    }

    try{
        const organization = await Organization.create({
            orgID,
            name, 
            description,
            phone,
            email,
            website,
            userID,
            profilePic,
            seminarLocations
        });
        res.status(200).json(organization);
    }catch(error){
        res.status(400).json({error: error.message});
    }
};

const deleteOrganization = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such organization with that id' });
    }

    const organization = await Organization.findByIdAndDelete(id);

    if (!organization) {
        return res.status(404).json({ error: 'No such organization' });
    }

    res.status(200).json({ message: 'Organization deleted successfully', organization });
};

const updateOrganization = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such organization with that id' });
    }

    const updates = req.body;

    try {
        const organization = await Organization.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!organization) {
            return res.status(404).json({ error: 'No such organization' });
        }

        res.status(200).json({ message: 'Organization updated successfully', organization });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getAllOrganizations,
    getOrganization,
    createOrganization,
    deleteOrganization,
    updateOrganization
};