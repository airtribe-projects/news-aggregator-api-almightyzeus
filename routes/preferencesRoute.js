const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const preferencesController = require('../controllers/preferencesController');

router.get('/', auth, preferencesController.getPreferences);
router.put('/', auth, preferencesController.updatePreferences);

module.exports = router;