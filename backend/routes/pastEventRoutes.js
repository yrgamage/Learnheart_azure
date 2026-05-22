const express = require('express');
const router = express.Router();
const pastEventController = require('../controllers/pastEventController');

// Create a new past event
router.post('/', pastEventController.createPastEvent);

// Get all past events for a specific organization
router.get('/organization/:organizationId', pastEventController.getOrganizationPastEvents);

// Get all past events
router.get('/', pastEventController.getAllPastEvents);

// Delete a past event
router.delete('/:id', pastEventController.deletePastEvent);

// Add a review to a past event
router.post('/:id/reviews', pastEventController.addReview);

module.exports = router; 