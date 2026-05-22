const express = require('express');
const {
    getAllSeminars,
    getSeminar,
    createSeminar,
    updateSeminar,
    deleteSeminar,
    getUpcomingSeminars,
    getPastSeminars
} = require('../controllers/seminarController');
const router = express.Router();

router.get('/', getAllSeminars);

router.get('/upcoming', getUpcomingSeminars)
router.get('/past', getPastSeminars)

router.get('/:id', getSeminar);
router.post('/', createSeminar);
router.delete('/:id', deleteSeminar);
router.put('/:id', updateSeminar);

module.exports = router;