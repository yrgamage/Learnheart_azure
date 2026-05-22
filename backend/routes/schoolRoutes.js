const express = require('express');
const {
    getAllSchools, 
    getSchool,
    createSchool,
    updateSchool,
    deleteSchool
} = require('../controllers/schoolController');
const router = express.Router();

router.get('/', getAllSchools);
router.get('/:id', getSchool);
router.post('/', createSchool);
router.patch('/:id', updateSchool);
router.delete('/:id', deleteSchool);

module.exports = router;
