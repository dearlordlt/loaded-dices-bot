const express = require('express');
// const ejs = require('ejs');
const MarkdownIt = require('markdown-it');
const { CharacterModel } = require('../models/player');
const { getCharacterFormatter } = require('../helpers/characterFormatter');

const router = express.Router();

const tpl = (char) => `
  # Attributes
  ${char.getAttributesAsMarkdown()}
`;


router.get('/:id', (req, res) => {
  CharacterModel.findOne({ playerId: req.params.id }, (err, character) => {
    if (err) {
      res.status(500).json(err);
    }
    const md = new MarkdownIt();
    const html = md.render(tpl(getCharacterFormatter(character)));

    res.status(200).send(html);
  });
});

module.exports = router;
