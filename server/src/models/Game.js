const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  white: {
    type: String,
    required: true
  },
  black: {
    type: String,
    required: true
  },
  result: {
    type: String,
    required: true,
    enum: ['1-0', '0-1', '1/2-1/2', '*']
  },
  date: {
    type: Date,
    required: true
  },
  event: String,
  site: String,
  round: String,
  opening: String,
  eco: String,
  pgn: {
    type: String,
    required: true
  },
  moves: [{
    san: String,
    fen: String,
    comment: String
  }],
  tags: [String]
}, {
  timestamps: true
});

// Index for efficient queries
gameSchema.index({ user: 1, date: -1 });
gameSchema.index({ user: 1, white: 1 });
gameSchema.index({ user: 1, black: 1 });
gameSchema.index({ user: 1, opening: 1 });
gameSchema.index({ user: 1, tags: 1 });

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
