const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const gameController = require('../controllers/gameController');

// All routes require authentication
router.use(auth);

// Upload PGN file
router.post('/upload', gameController.uploadPgn);

// Get all games for the user
router.get('/', gameController.getGames);

// Get a specific game
router.get('/:id', gameController.getGame);

// Delete a game
router.delete('/:id', gameController.deleteGame);

module.exports = router;
