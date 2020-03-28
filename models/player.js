const mongoose = require('mongoose');

const combatSkillSchema = new mongoose.Schema({
  name: String, lvl: Number, attack: String, defense: String,
});
const playerSchema = new mongoose.Schema({
  playerId: Number,
  name: String,
  attr: {
    str: Number,
    sta: Number,
    dex: Number,
    ref: Number,
    per: Number,
    will: Number,
  },
  combatSkills: [combatSkillSchema],
});
const PlayerModel = mongoose.model('Player', playerSchema);

module.exports = {
  PlayerModel,
};
