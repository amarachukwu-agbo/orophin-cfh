const mongoose = require('mongoose');

const { Schema } = mongoose;
// gameSchema
const GameSchema = new Schema({
  userID: String,
  gameID: String,
  gamePlayers: [],
  gameRound: Number,
  gameWinner: { type: String, default: '' }
}, { timestamps: true });

mongoose.model('GameLog', GameSchema);
