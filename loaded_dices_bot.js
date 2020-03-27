const discord = require('discord.js');
const client = new discord.Client();
const parser = require('discord-command-parser');
require('dotenv').config();
const prefix = '!';

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

    if (parsed.command === 'c') {
        let args=msg.content.match(/!c \s*(\d)*\s*([+-])*\s*(\d)*/i);
        let dices =parseInt(args[1] || "3");
        // let hasBonus = false;
        // if (parsed.arguments[0] && parsed.arguments[0].charAt(0) === '+') {
        //     dices = 3;
        //     hasBonus = parseInt(parsed.arguments[0].replace('+', ''));
        // }
        if (dices > 0) {
            let sum = 0;
            let reply = '';
            for (let i = 0; i < dices; i++) {
                const roll = r();
                sum += roll;
                if (i>0)
                    reply += ';';
                reply += roll;
            }
            // if (parsed.arguments[1] === '+') {
            //     sum = sum + parseInt(parsed.arguments[2]);
            // }
            // if (hasBonus) {
            //     sum = sum + hasBonus;
            // }
            let sign=(args[2]==="-")?-1:1;
            let mod=parseInt(args[3] || "0");
            
            sum = sum;
            mod=sign*mod;
            
            let line = `roll: [${reply}] = ${sum}`;
            if (mod!=0)
                line =`${line} ${(mod>0)?'+'+mod:mod}=${sum+mod}`;
                
            sendMsg(msg, line, parsed.command, parsed.arguments);
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
            let reply = '';
            let successes = 0;
            let rerolls = 0;
            let botch = false;
            let botchRoll = 0;
            for (let i = 0; i < dices; i++) {
                const roll = r();
                if (roll >= effectiveness) {
                    successes += 1;
                }
                if (roll === 6) {
                    rerolls += 1;
                }
                if (roll === 1) {
                    botchRoll += 1;
                    botch = true;
                }
                reply += roll + ',';
            }
            if (!botch) {
                for (let i = 0; i < rerolls; i++) {
                    const roll = r();
                    if (roll >= effectiveness) {
                        successes += 1;
                    }
                    if (roll === 6) {
                        rerolls += 1;
                    }
                    reply += '+' + roll + ',';
                }
            }
            if (botchRoll >= dices / 2) {
                const line = `roll ${dices}d: (${reply}) = Botch roll!`;
                sendMsg(msg, line, parsed.command, parsed.arguments);
            } else {
                const line = `roll ${dices}d: (${reply}) = ${successes} with effectiveness of ${effectiveness}`;
                sendMsg(msg, line, parsed.command, parsed.arguments);
            }

        } else {
            sendMsg(msg, 'how many?', parsed.command, parsed.arguments);
        }
    }

    if (parsed.command === 'h') {
        msg.reply(`
          COMBAT:
            !c 3 + 10 //3d6 + 10
            !c + 10 //3d6 + 10
            !c //3d6
          SOCIAL:
            !s 5 4 //5d6 when 4 and more is success
            !s 3 //3d6 when 4 and more is success
          DAMAGE:
            !d 3 BBC //3d when 4 is B, 5 is B and 6 is C
          OTHER:
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

const r = () => {
    return Math.ceil(Math.random() * 6)
}

client.login(process.env.API_KEY);
