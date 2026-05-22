const express = require('express');
const {
  getAllResources,
  getNotes,
  getVideos,
  getNotesWithPaginate,
  getVideosWithPaginate,
  getResourceById,
  addResource,
  updateResource,
  deleteResource,
  upload
} = require('../controllers/resourceController'); 

const router = express.Router();

// Routes
router.get('/', getAllResources);
router.get('/notes', getNotes);
router.get('/videos', getVideos);
router.post('/notes/withPaginate', getNotesWithPaginate);
router.post('/videos/withPaginate', getVideosWithPaginate);
router.get('/:id', getResourceById); 
router.post('/', upload, addResource); // supports PDF uploads
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);

module.exports = router;


