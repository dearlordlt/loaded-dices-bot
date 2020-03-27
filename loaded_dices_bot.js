const discord = require('discord.js');
const parser = require('discord-command-parser');
const { Rules } = require('./ajax-rules.js');

require('dotenv').config();

const client = new discord.Client();
const prefix = '!';
const localVariablesMap = {};

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
        const author = msg.author.id;

        if (!localVariablesMap.hasOwnProperty(author))
            localVariablesMap[author] = {};
        let args = msg.content.match(/!var\s*([a-z]+)\s+(\S+)/i);
        if (args) {
            localVariablesMap[author][args[1]] = parseInt(args[2]);
            sendMsg(msg, `added ${args[1]}=${args[2]} for ${author}`);
        }

    }
    if (parsed.command === 'c') {
        let args = msg.content.match(/!c\s*(\d*)*\s*([a-z]*)*\s*([+-])*\s*(\d*)*/i);
        let dices = parseInt(args[1] || "3");
        let variable = args[2] || "<not exists>";
        let sign = (args[3] === "-") ? -1 : 1;
        let mod = parseInt(args[4] || "0");
        mod = sign * mod;

        if (dices > 0) {
            const bonus = getVariable(msg.author.id, variable);
            if (bonus !== 0) {
                sendMsg(msg, `using ${variable}=${bonus}`);
                mod = mod + bonus;
            }
            sendMsg(msg, combatRoll(dices, mod), args);

        } else {
            sendMsg(msg, 'how many?', parsed.command, parsed.arguments);
        }
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
        let roll = [...Array(3)].map(el => el = r());
        let debug = false;
        let dices = 3;

        if (parsed.arguments[0]) {
            roll = parsed.arguments[0].split('').map(el => el = parseInt(el));
            dices = parsed.arguments[0].split('').length;
            debug = true;
        }

        let initialRollSum = roll.reduce((a, b) => a + b, 0);

        roll = [...roll, ...explode(roll)];

        const sum = roll.reduce((a, b) => a + b, 0);
        const successDice = roll.some(el => el > 3);
        const successValue = roll.filter(el => el > 3).length;

        let message = successDice && sum > 7 ? 'success' : 'failure';
        (initialRollSum >= 17) ? message = `**critical success !!!** ${Rules.getMagicFortune(r(), initialRollSum)}` : null;
        (initialRollSum <= 4) ? message = `**critical failure !!!** ${Rules.getMagicMisfortune(r(), initialRollSum)}` : null;

        let line = `roll 3d: [${decorateRoll(roll, dices)}] = ${successValue}; ${message} ${debug ? ', this is fake roll' : ''}`;
        sendMsg(msg, line, parsed.command, parsed.arguments);
    }

    if (parsed.command === 'l') {
        const roll = r();
        let line = `${roll} hits ${Rules.getLocation(6)}`;
        sendMsg(msg, line, parsed.command, parsed.arguments);
    }

    if (parsed.command === 'sl') {
        const roll = r();
        const location = parseInt(parsed.arguments[0]) || 1;

        if (location < 1 || location > 6) {
            sendMsg(msg, `please set location (1,2,3,4,5,6)`, parsed.command, parsed.arguments);
        } else {
            const locationStr = Rules.locations[location - 1];

            let line = `${roll} hits ${Rules.getSubLocation(roll, locationStr)}`;
            sendMsg(msg, line, parsed.command, parsed.arguments);
        }
    }

    if (parsed.command === 'crit') {
        const roll = r();
        const type = parsed.arguments[0] || 'melee'; //melee, ranged, spell
        const value = parsed.arguments[1] || '17'; //3, 4, 17, 18
        let err = false;

        if (type != 'melee' && type != 'ranged' && type != 'spell') {
            sendMsg(msg, `unknown type: ${type}, must be melee, ranged or spell`, parsed.command, parsed.arguments);
            err = true;
        }

        if (value != '3' && value != '4' && value != '17' && value != '18') {
            sendMsg(msg, `wrong value: ${value}, must be 3, 4, 17 or 18`, parsed.command, parsed.arguments);
            err = true;
        }

        let message = '';

        if (type === 'melee') {
            if (value == 17 || value == 18) message = Rules.getMeleeFortune(roll, value);
            if (value == 3 || value == 4) message = Rules.getMeleeMisfortune(roll, value);
        }

        if (type === 'ranged') {
            if (value == 17 || value == 18) message = Rules.getRangedFortune(roll, value);
            if (value == 3 || value == 4) message = Rules.getRangedMisfortune(roll, value);
        }

        if (type === 'spell') {
            if (value == 17 || value == 18) message = Rules.getMagicFortune(roll, value);
            if (value == 3 || value == 4) message = Rules.getMagicMisfortune(roll, value);
        }

        let line = `roll - ${roll}: ${message}`;
        !err && sendMsg(msg, line, parsed.command, parsed.arguments);
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
          **VAR:**
            !var bow 18 //sets bow to 18 for user
            !c bow //rolls 3d + bow
          **SPELL:**
            !spell //rolls 3d spell roll
          **OTHER:**
            !rules //links to resources
            !l //roll unaimed location
            !sl 1 //1,2,3,4,5,6 represents head, body, l.arm, r.arm, l.leg, r.leg
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

const r = () => {
    return Math.ceil(Math.random() * 6)
}

const explode = (arr) => {
    let newArr = [...Array(arr.filter(el => el === 6).length)].map(el => el = r());
    if (newArr.some(el => el === 6)) {
        newArr = [...newArr, ...explode(newArr)];
    }
    return newArr;
}

const getVariable = (author, varName) => {
    if (localVariablesMap.hasOwnProperty(author))
        if (localVariablesMap[author].hasOwnProperty(varName))
            return localVariablesMap[author][varName];
    return 0;
}

const combatRoll = (dices, mod) => {
    let sum = 0;
    let reply = '';
    for (let i = 0; i < dices; i++) {
        const roll = r();
        sum += roll;
        if (i > 0)
            reply += ';';
        reply += roll;
    }

    console.log(dices, mod);
    let line = `roll: [${reply}] = ${sum}`;
    if (mod != 0)
        line = `${line} ${(mod > 0) ? '+' + mod : mod}=${sum + mod}`;

    return line;
}

client.login(process.env.API_KEY);
