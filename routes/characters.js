const express = require('express');
const ejs = require('ejs');

const tpl = `
  <div><h1>Attributes</h1></div>
  <div>STR: <%= character.attr.str %></div>
  <div>STR: <%= character.attr.sta %></div>
  <div>STR: <%= character.attr.ref %></div>
  <div>STR: <%= character.attr.dex %></div>
  <div>STR: <%= character.attr.per %></div>
  <div>STR: <%= character.attr.will %></div>

  <div><h1>Combat Skills</h1></div>
  <% if (character.combatSkills.length > 0){%>
    <ul class="skills">
      <% for (var i = 0; i < character.combatSkills.length; i++) { %>
        <li class="skill">
            <div>NAME: <%= character.combatSkills[i].name %></div>
            <div>LVL: <%= character.combatSkills[i].lvl %></div>
            <div>DEFENCE: <%= character.combatSkills[i].defense %></div>
            <div>ATTACK: <%= character.combatSkills[i].attack %></div>
        </li>
      <% } %>
    </ul>
  <%}%>
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
