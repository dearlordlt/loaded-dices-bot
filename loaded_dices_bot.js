/* eslint-disable no-console */
require('dotenv').config();

const discord = require('discord.js');
const parser = require('discord-command-parser');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const { sendMsg, printEnvHelp, printOtherHelp } = require('./utils');
const { Environment } = require('./ajax-env.js');
const { sublocation } = require('./commands/sublocation');
const { location, printLocationHelp } = require('./commands/location');
const { spell, printSpellHelp } = require('./commands/spell');
const { social, printSocialHelp } = require('./commands/social');
const { damage, printDamageHelp } = require('./commands/damage');
const { variables } = require('./commands/variables');
const { combat } = require('./commands/combat');
const { playerManager } = require('./playerManager');
const { contextManager } = require('./context');
const { crit, printCritHelp } = require('./commands/crit');

const characters = require('./routes/characters');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));

const client = new discord.Client();
const prefix = '!';
let environment = new Environment();

client.on('ready', () => {
  console.log(`Connected as ${client.user.tag}`);
  client.user.setActivity('Loading dices');
});

client.on('message', (msg) => {
  if (msg.author.bot) return;
  let parsed = parser.parse(msg, prefix);
  if (!parsed.success) return;

  if (parsed.command === 'luck') {
    // reroll the last user command
    const oldMsg = contextManager.getUserContext(msg.author.id).pop();
    sendMsg(msg, 're roll last command');
    // eslint-disable-next-line no-param-reassign
    msg = oldMsg;
    parsed = parser.parse(msg, prefix);
  } else {
    contextManager.getUserContext(msg.author.id).push(msg);
  }

  if (parsed.command === 'p') {
    playerManager.getPlayer(msg.author.id, msg.member.displayName).handle(msg);
    return;
  }

  if (parsed.command === 'var') {
    variables.handle(msg);
    return;
  }

  if (parsed.command === 'c') {
    combat.handle(msg, environment);
    return;
  }

  if (parsed.command === 'env') {
    // eslint-disable-next-line no-use-before-define
    environmentCommandHandler(msg);
    return;
  }

  if (parsed.command === 'd') {
    damage(parsed.arguments, parsed.command, sendMsg, msg);
    return;
  }

  if (parsed.command === 's') {
    social(parsed.arguments, parsed.command, sendMsg, msg);
    return;
  }

  if (parsed.command === 'spell') {
    spell(parsed.arguments, parsed.command, sendMsg, msg);
    return;
  }

  if (parsed.command === 'l') {
    location(parsed.arguments, parsed.command, sendMsg, msg);
    return;
  }

  if (parsed.command === 'sl') {
    sublocation(parsed.arguments, parsed.command, sendMsg, msg);
    return;
  }

  if (parsed.command === 'crit') {
    crit(parsed.arguments, parsed.command, sendMsg, msg);
    return;
  }

  if (parsed.command === 'h') {
    msg.reply(`
          ${combat.help().trim()}
          ${printSocialHelp().trim()}
          ${printDamageHelp().trim()}
          ${variables.help().trim()}
          ${printSpellHelp().trim()}
          ${printLocationHelp().trim()}
          ${printEnvHelp().trim()}
          ${printCritHelp().trim()}
          ${printOtherHelp().trim()}
        `);
  }

  if (parsed.command === 'rules') {
    msg.reply(`
            RULES: https://docs.google.com/document/d/1UDLsRMishYo1g9DEWHYx9pjEjcTNG2SON9UiSlkfH2Y/edit?usp=sharing
            CHAR SHEET: https://docs.google.com/document/d/1pbIxLLUEEq0xLVn5_oYL9G0Obv8INCiuG-LomDHvPVA/edit?usp=sharing
        `);
  }
});

const environmentCommandHandler = (msg) => {
  const args = msg.content.match(/!env\s*((autofail\s(\d+))*(clear)*(list)*)\s*/i);
  if (args) {
    if (args[1] === 'clear') {
      environment = new Environment();
      msg.reply('environment restored to default values');
    } else if (args[1] === '') {
      msg.reply(`**environment**\nautofail=${environment.autofail}`);
    } else {
      environment.autofail = parseInt(args[3], 10);
      msg.reply(`autofail=${environment.autofail}`);
    }
  }
};

client.login(process.env.API_KEY);

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));

app.use('/characters', characters);

app.get('/', (req, res) => res.send('Kill all humans! all bots unite!!'));

app.get('*', (_req, res) => {
  res.status(404).send('ERROR 404');
});

app.listen(port, () => console.log(`Loaded dice bot is listening on port ${port}!`));
