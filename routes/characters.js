const express = require('express');
// const ejs = require('ejs');
const MarkdownIt = require('markdown-it');
const { CharacterModel } = require('../models/player');
const { getCharacterFormatter } = require('../helpers/characterFormatter');

const router = express.Router();

const tpl = (char) => `
  # Attributes
  ${char.getAttributesAsMarkdown()}

| a | a | a | a | a |
|---|---|---|---|---|
| s | s | s | s | s |
| s | s | s | s | s |


|str|sta|dex|ref|per|will|
|---|---|---|---|---|---|
|10|10|10|10|10|10|
`;


router.get('/:id', (req, res) => {
  CharacterModel.findOne({ playerId: req.params.id }, (err, character) => {
    if (err) {
      res.status(500).json(err);
    }
    const md = new MarkdownIt();
    const text = tpl(getCharacterFormatter(character));
    console.log(text);
    const html = md.render(text);

    res.status(200).send(html);
  });
});

module.exports = router;
