const { Chess } = require('chess.js');
const Game = require('../models/Game');
const fs = require('fs').promises;

exports.uploadPgn = async (req, res) => {
  try {
    if (!req.files || !req.files.pgn) {
      return res.status(400).json({ message: 'No PGN file uploaded' });
    }

    const pgnFile = req.files.pgn;
    
    // Read the file content
    let pgnContent;
    try {
      if (pgnFile.tempFilePath) {
        pgnContent = await fs.readFile(pgnFile.tempFilePath, 'utf8');
      } else {
        pgnContent = pgnFile.data.toString('utf8');
      }
    } catch (err) {
      console.error('Error reading PGN file:', err);
      return res.status(400).json({ message: 'Error reading PGN file' });
    }

    // Split PGN content into individual games
    const gameStrings = pgnContent.split(/\n\n(?=\[)/);
    console.log(`Found ${gameStrings.length} potential games in PGN file`);
    
    const games = [];
    
    for (const gamePgn of gameStrings) {
      if (!gamePgn.trim()) continue;
      
      try {
        const chess = new Chess(); // Create new instance for each game
        
        try {
          chess.loadPgn(gamePgn.trim(), { strict: false });
        } catch (parseErr) {
          console.error('Failed to parse PGN:', parseErr);
          continue;
        }

        const header = chess.header();
        console.log('Successfully parsed game header:', header);
        
        const game = new Game({
          user: req.user._id,
          white: header.White || 'Unknown',
          black: header.Black || 'Unknown',
          result: header.Result || '*',
          date: header.Date ? new Date(header.Date.replace(/\./g, '-')) : new Date(),
          event: header.Event || 'Unknown Event',
          site: header.Site || 'Unknown Site',
          round: header.Round || '-',
          opening: header.Opening || 'Unknown Opening',
          eco: header.ECO || '-',
          pgn: gamePgn.trim(),
          moves: chess.history({ verbose: true }),
          fen: chess.fen()
        });

        await game.save();
        games.push(game);
      } catch (err) {
        console.error('Error processing game:', err);
        // Continue with next game instead of failing entire upload
        continue;
      }
    }

    if (games.length === 0) {
      return res.status(400).json({ message: 'No valid games found in PGN file' });
    }

    console.log(`Successfully imported ${games.length} games`);
    res.json({ 
      message: `Successfully imported ${games.length} games`,
      games: games 
    });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Error uploading games' });
  }
};

exports.getGames = async (req, res) => {
  try {
    const games = await Game.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(100);
    res.json(games);
  } catch (err) {
    console.error('Error fetching games:', err);
    res.status(500).json({ message: 'Error fetching games' });
  }
};

exports.getGame = async (req, res) => {
  try {
    const game = await Game.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(game);
  } catch (err) {
    console.error('Error fetching game:', err);
    res.status(500).json({ message: 'Error fetching game' });
  }
};

exports.deleteGame = async (req, res) => {
  try {
    const game = await Game.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json({ message: 'Game deleted successfully' });
  } catch (err) {
    console.error('Error deleting game:', err);
    res.status(500).json({ message: 'Error deleting game' });
  }
};
