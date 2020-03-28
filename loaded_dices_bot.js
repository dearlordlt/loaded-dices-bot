const discord = require('discord.js');
const parser = require('discord-command-parser');
const { sendMsg } = require('./utils');
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
require('dotenv').config();

const client = new discord.Client();
const prefix = '!';
let environment = new Environment();
client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}`);
    client.user.setActivity('Loading dices');
});


client.on('message', msg => {
    if (msg.author.bot) return;
    const parsed = parser.parse(msg, prefix);
    if (!parsed.success) return;

    

    if(parsed.command ==='luck'){
        //reroll the last user command
        const oldMsg=contextManager.getUserContext(msg.author.id).pop();
        sendMsg(msg,`re roll last command`, msg);
        msg=oldMsg;

    }else{
        contextManager.getUserContext(msg.author.id).push(msg);
    }

    if (parsed.command === 'p'){
        playerManager.getPlayer(msg.author.id).handle(msg);
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
          ${combat.help()}
          ${printSocialHelp()}
          ${printDamageHelp()}
          ${variables.help()}
          ${printSpellHelp()}
          ${printLocationHelp()}
          **ENVIRONMENT**
            !env //prints current environment
            !env clear //restores default
            !env autofail 9 //sets autofail to 9
          ${printCritHelp()}
          **OTHER:**
            !rules //links to resources
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
