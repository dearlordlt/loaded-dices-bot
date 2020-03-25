const discord = require('discord.js');
const client = new discord.Client();
const parser = require('discord-command-parser');
require('dotenv').config();
const prefix = '!';

client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}`);
    client.user.setActivity('Loading dices');
});

client.on('message', msg => {
    const parsed = parser.parse(msg, prefix);
    if (msg.author.bot) return;
    if (!parsed.success) return;

    if (parsed.command === 'c') {
        let dices = parseInt(parsed.arguments[0]) || 3;
        let hasBonus = false;
        if (parsed.arguments[0] && parsed.arguments[0].charAt(0) === '+') {
            dices = 3;
            hasBonus = parseInt(parsed.arguments[0].replace('+', ''));
        }
        if (dices > 0) {
            let sum = 0;
            let reply = '';
            for (let i = 0; i < dices; i++) {
                const roll = r();
                sum += roll;
                reply += roll + ',';
            }
            if (parsed.arguments[1] === '+') {
                sum = sum + parseInt(parsed.arguments[2]);
            }
            if (hasBonus) {
                sum = sum + hasBonus;
            }
            msg.reply(`roll: (${reply}) = ${sum}`);
        } else {
            msg.reply('how many?');
        }
    }

    if (parsed.command === 'd') {
        const dices = parseInt(parsed.arguments[0]);

        if (!parsed.arguments[1]) {
            msg.reply('choose effects, a.e. !d 3 BBT');
            return;
        }

        const damage = parsed.arguments[1].split('');
        const arr6 = Array('-', '-', '-', '-', '-', '-');

        if (dices > 0) {
            for (let i = 5; i >= 0; i--) {
                if (damage) arr6[i] = damage.pop();
                else break;
            }
            let reply = '';
            let effects = '';
            console.log(arr6);
            for (let i = 0; i < dices; i++) {
                const roll = r();
                effects += arr6[roll - 1] ? arr6[roll - 1] : '';
                reply += roll + ',';
            }
            msg.reply(`roll ${dices}d and damage ${parsed.arguments[1]}: Result (${effects}), Roll (${reply})`);
        } else {
            msg.reply('how many?');
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
                msg.reply(`roll ${dices}d: (${reply}) = Botch roll!`);
            } else {
                msg.reply(`roll ${dices}d: (${reply}) = ${successes} with effectiveness of ${effectiveness}`);
            }

        } else {
            msg.reply('how many?');
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

function r() {
    return Math.ceil(Math.random() * 6)
}

client.login(process.env.API_KEY);
