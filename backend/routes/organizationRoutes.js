const express = require('express');
const {
    getAllOrganizations,
    getOrganization,
    createOrganization,
    updateOrganization,
    deleteOrganization
} = require('../controllers/organizationController');
const router = express.Router();


router.get('/', getAllOrganizations);
router.get('/:id', getOrganization);
router.post('/', createOrganization);
router.put('/:id', updateOrganization);
router.delete('/:id', deleteOrganization);

module.exports = router;