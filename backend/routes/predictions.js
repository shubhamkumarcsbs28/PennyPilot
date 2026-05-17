const router = require('express').Router();
const { getPredictions } = require('../controllers/predictionController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getPredictions);

module.exports = router;
