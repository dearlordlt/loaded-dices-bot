const discord = require('discord.js');
const parser = require('discord-command-parser');
const { r } = require('./utils');
const { Environment } = require('./ajax-env.js');
const { sublocation } = require('./commands/sublocation');
const { location } = require('./commands/location');
const { spell } = require('./commands/spell');
require('dotenv').config();

const client = new discord.Client();
const prefix = '!';
const localVariablesMap = {};
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
        varCommandHandler(msg);
        return;
    }
    if (parsed.command === 'c') {
        combatCommandHandler(msg);
        return;
    }
    if (parsed.command === 'ctx') {
        environmentCommandHandler(msg);
        return;
    }

    if (parsed.command === 'd') {
        const dices = parseInt(parsed.arguments[0]);

        if (!parsed.arguments[1]) {
            const line = 'choose effects, a.e. !d 3 BBT';
            sendMsg(msg, line, parsed.command, parsed.arguments);
            return;
        }

        const damage = parsed.arguments[1].split('');

        if (dices > 0) {
            let arr6 = [...Array(6)].map(e => e = damage.pop() || '').reverse();
            let reply = '';
            let effects = '';
            for (let i = 0; i < dices; i++) {
                const roll = r();
                effects += arr6[roll - 1] ? arr6[roll - 1] : '';
                reply += roll + ',';
            }
            const line = `roll ${dices}d and damage ${parsed.arguments[1]}: Result (${effects}), Roll (${reply})`;
            sendMsg(msg, line, parsed.command, parsed.arguments);
        } else {
            sendMsg(msg, 'how many?', parsed.command, parsed.arguments);
        }
    }

    if (parsed.command === 's') {
        const dices = parseInt(parsed.arguments[0]);
        const effectiveness = parseInt(parsed.arguments[1]) || 4;

        if (dices > 0) {
            let roll = [...Array(dices)].map(el => el = r());

            roll = [...roll, ...explode(roll)];

            const botchDice = roll.filter(el => el === 1).length;
            const successDice = roll.filter(el => el >= effectiveness).length;

            let message = botchDice >= dices / 2 ? '**botch**' : `success ${successDice >= dices ? '***skill increase!***' : ''}`;

            let line = `roll ${dices}d: [${decorateRoll(roll, dices)}] = ${successDice}; ${message} with effectiveness of ${effectiveness}`;
            sendMsg(msg, line, parsed.command, parsed.arguments);
        } else {
            sendMsg(msg, 'how many?', parsed.command, parsed.arguments);
        }
    }

    if (parsed.command === 'spell') {
        spell(parsed.arguments, parsed.command, sendMsg, msg);
    }

    if (parsed.command === 'l') {
        location(parsed.arguments, parsed.command, sendMsg, msg);
    }

    if (parsed.command === 'sl') {
        sublocation(parsed.arguments, parsed.command, sendMsg, msg);
    }

    if (parsed.command === 'crit') {
        crit(parsed.arguments, parsed.command, sendMsg, msg);
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
          ${printVarHelp()}
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
const combatCommandHandler=(msg)=>{
    let args = msg.content.match(/!c\s*(\d*)*\s*([a-z]*)*\s*([+-])*\s*(\d*)*/i);
    let dices = parseInt(args[1] || "3");
    const variable = args[2] || "<not exists>";
    let sign = (args[3] === "-") ? -1 : 1;
    let mod = parseInt(args[4] || "0");
    mod = sign * mod;

    if (dices > 0) {
        const bonus = getVariable(msg.author.id, variable);
        if (bonus !== 0) {
            sendMsg(msg, `using ${variable}=${bonus}`);
            mod = mod + bonus;
        }
        let roll = [...Array(dices)].map(el => el = r());
        let initialRollSum = roll.reduce((a, b) => a + b, 0);
        let line= `roll: [${decorateRoll(roll, dices)}] = ${initialRollSum}`;
        if (initialRollSum>16)
            line=`${line} **critical success !!!** `;
        if (initialRollSum<5)
            line=`${line} **critical failure !!!** `;

        if (initialRollSum<=environment.autofail) {
            line=`${line} **autofail**`;
            sendMsg(msg, line);
            return;
        }

        if (mod != 0)
            line = `${line} ${(mod > 0) ? '+' + mod : mod}=${initialRollSum + mod}`;

        sendMsg(msg, line);


    } else {
        sendMsg(msg, 'how many?');
    }
}
const environmentCommandHandler=(msg)=>{
    let args = msg.content.match(/!env\s*((autofail\s(\d+))*(clear)*(list)*)\s*/i);
    if (args) {
        
        if (args[1] === 'clear') {
            environment = new Environment();
            msg.reply(`environment restored to default values`);
            return;
        }
        else if (args[1]=== '') {
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

const varCommandHandler = (msg) => {
    const author = msg.author.id;

    if (!(author in localVariablesMap))
        localVariablesMap[author] = {};
    let args = msg.content.match(/!var\s*((list)*(clear)*)\s*/i);
    if (args) {
        if (args[1] === 'list') {
            let lines = '';
            const myVars = localVariablesMap[author];
            Object.keys(myVars).forEach(e => lines = `${lines}\n ${e}=${myVars[e]}`);
            msg.reply(`**Variables:**\n${lines}`);
            return;
        }
        else if (args[1] === 'clear') {
            delete localVariablesMap[author];
            sendMsg(msg, `all variables cleared`);
            return;
        }

    }
    args = msg.content.match(/!var\s*([a-z]+)\s*(\S*)/i);
    if (args) {
        if (args[2]) {
            localVariablesMap[author][args[1]] = parseInt(args[2]);
            sendMsg(msg, `added ${args[1]}=${args[2]}`);
        }
        else if (args[1] in localVariablesMap[author]) {
            delete localVariablesMap[author][args[1]];
            sendMsg(msg, `removed ${args[1]}`);
        }
        return;
    }
    //print help
    sendMsg(msg, printVarHelp());

}

const printVarHelp = () => {
    return `**VAR:**
            !var bow 18 //sets bow to 18 for user
            !c bow //rolls 3d + bow
            !var list //list all variables for user
            !var clear //clear all variable for user
            !var bow //removes only bow variable`;
}

const decorateRoll = (roll, dices = 3) => {
    console.log(roll);
    roll = roll.map((el, index) => {
        if (index >= dices) {
            return `**${el}**`
        }
        else if (el === 6) {
            return `__${el}__`
        }
        else if (el === 1) {
            return `~~${el}~~`
        } else {
            return el;
        }
    });
    return roll;
}

const explode = (arr) => {
    let newArr = [...Array(arr.filter(el => el === 6).length)].map(el => el = r());
    if (newArr.some(el => el === 6)) {
        newArr = [...newArr, ...explode(newArr)];
    }
    return newArr;
}

const getVariable = (author, varName) => {
    if (author in localVariablesMap)
        if (varName in localVariablesMap[author])
            return localVariablesMap[author][varName];
    return 0;
}


client.login(process.env.API_KEY);
