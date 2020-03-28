const express = require('express');
const ejs = require('ejs');

const tpl = `
  <div>STR: <%= character.attr.str %></div>
  <div>STR: <%= character.attr.sta %></div>
  <div>STR: <%= character.attr.ref %></div>
  <div>STR: <%= character.attr.dex %></div>
  <div>STR: <%= character.attr.per %></div>
  <div>STR: <%= character.attr.will %></div>
`;

const { PlayerModel } = require('../models/player');

const router = express.Router();

router.get('/:id', (req, res) => {
  PlayerModel.findOne({ playerId: req.params.id }, (err, character) => {
    if (err) {
      res.status(500).json(err);
    }

    const html = ejs.render(tpl, { character });

    res.status(200).send(html);
  });
});

module.exports = router;
