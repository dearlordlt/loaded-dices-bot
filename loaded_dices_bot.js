const discord = require('discord.js');
const parser = require('discord-command-parser');
const { r, explode, decorateRoll } = require('./utils');
const { Environment } = require('./ajax-env.js');
const { sublocation } = require('./commands/sublocation');
const { location } = require('./commands/location');
const { spell } = require('./commands/spell');
const { social } = require('./commands/social');
const { damage } = require('./commands/damage');
const { variables } = require('./commands/variables');
require('dotenv').config();

const client = new discord.Client();
const prefix = '!';
let environment = new Environment();
client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}`);
    client.user.setActivity('Loading dices');
});

const sendMsg = (msg, line, command = '', args = []) => {
    msg.reply(line);
    console.log(line, command, args);
}
client.on('message', msg => {
    const parsed = parser.parse(msg, prefix);

    if (msg.author.bot) return;
    if (!parsed.success) return;

    if (parsed.command === 'var') {
        variables.handle(msg);
        return;
    }

    if (parsed.command === 'c') {
        combatCommandHandler(msg);
        return;
    }

    if (parsed.command === 'env') {
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
          **COMBAT:**
            !c 3 + 10 //3d6 + 10
            !c + 10 //3d6 + 10
            !c //3d6
          **SOCIAL:**
            !s 5 4 //5d6 when 4 and more is success
            !s 3 //3d6 when 4 and more is success
          **DAMAGE:**
            !d 3 BBC //3d when 4 is B, 5 is B and 6 is C
          ${variables.help()}
          **SPELL:**
            !spell //rolls 3d spell roll
          **LOCATIONS**
            !l //roll unaimed location
            !sl 1 //1,2,3,4,5,6 represents head, body, l.arm, r.arm, l.leg, r.leg
          **ENVIRONMENT**
            !env //prints current environment
            !env clear //restores default
            !env autofail 9 //sets autofail to 9
          **OTHER:**
            !rules //links to resources
            !crit melee|ranged|spell 3|4|17|18
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
    let args = msg.content.match(/!env\s*((autofail\s(\d+))*(clear)*(list)*)\s*/i);
    if (args) {

        if (args[1] === 'clear') {
            environment = new Environment();
            msg.reply(`environment restored to default values`);
            return;
        }
        else if (args[1] === '') {
            msg.reply(`**environment**\nautofail=${environment.autofail}`);
            return;
        }
        else {
            environment.autofail = parseInt(args[3]);
            msg.reply(`autofail=${environment.autofail}`);
            return;
        }

    }

}




client.login(process.env.API_KEY);
