const express = require('express');

const { PlayerModel } = require('../models/player');

const router = express.Router();

router.get('/:id', (req, res) => {
  PlayerModel.findOne({ playerId: req.params.id }, (err, character) => {
    if (err) {
      res.status(500).json(err);
    }

    res.status(200).json(JSON.parse(character));
  });
});

module.exports = router;
