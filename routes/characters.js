const express = require('express');
// const ejs = require('ejs');
const MarkdownIt = require('markdown-it');
const { CharacterModel } = require('../models/player');
const { getCharacterFormatter } = require('../helpers/characterFormatter');

const router = express.Router();

const tpl = (char) => `
  # Attributes
${char.getAttributesAsMarkdown()}
  # Combat skills
  ${char.getCombatSkillsAsMarkdown()}
`;


router.get('/:id', (req, res) => {
  CharacterModel.findOne({ playerId: req.params.id }, (err, character) => {
    if (err) {
      res.status(500).json(err);
    }
    const md = new MarkdownIt();
    md.renderer.rules.table_open = () => '<table class="table table-striped">\n';
    const text = tpl(getCharacterFormatter(character));
    const html = `<html>
    <head>
      <title>markdown-it demo</title>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <script src="https://cdn.jsdelivr.net/bootstrap/3.2.0/js/bootstrap.min.js"></script>
    </head>
    <body>
    ${md.render(text)}
    </body>
  </html>`;

    res.status(200).send(html);
  });
});

module.exports = router;
