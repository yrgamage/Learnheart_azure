const PastEvent = require('../models/PastEvent');
const Organization = require('../models/organizationModel');

// Create a new past event
exports.createPastEvent = async (req, res) => {
    try {
        const pastEvent = new PastEvent(req.body);
        await pastEvent.save();
        res.status(201).json(pastEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all past events for an organization
exports.getOrganizationPastEvents = async (req, res) => {
    try {
        const pastEvents = await PastEvent.find({ organizationId: req.params.organizationId })
            .sort({ seminarDate: -1 });
        res.json(pastEvents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all past events
exports.getAllPastEvents = async (req, res) => {
    try {
        const pastEvents = await PastEvent.find().sort({ seminarDate: -1 });
        
        // Fetch organization names for all events
        const eventsWithOrgNames = await Promise.all(pastEvents.map(async (event) => {
            const organization = await Organization.findOne({ userID: event.organizationId });
            return {
                ...event.toObject(),
                organizationName: organization ? organization.name : 'Unknown Organization'
            };
        }));
        
        res.json(eventsWithOrgNames);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a past event
exports.deletePastEvent = async (req, res) => {
    try {
        const event = await PastEvent.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a review to a past event
exports.addReview = async (req, res) => {
    try {
        const event = await PastEvent.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        const review = {
            userId: req.body.userId,
            rating: req.body.rating,
            comment: req.body.comment
        };
        
        event.reviews.push(review);
        await event.save();
        
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; 