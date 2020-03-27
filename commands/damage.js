const { r } = require('../utils');

const damage = (args, command, sendMsg, msg) => {
    const dices = parseInt(args[0]);

    if (!args[1]) {
        const line = 'choose effects, a.e. !d 3 BBT';
        sendMsg(msg, line, command, args);
        return;
    }

    const damage = args[1].split('');

    if (dices > 0) {
        let arr6 = [...Array(6)].map(e => e = damage.pop() || '').reverse();
        let reply = '';
        let effects = '';
        for (let i = 0; i < dices; i++) {
            const roll = r();
            effects += arr6[roll - 1] ? arr6[roll - 1] : '';
            reply += roll + ',';
        }
        const line = `roll ${dices}d and damage ${args[1]}: Result (${effects}), Roll (${reply})`;
        sendMsg(msg, line, command, args);
    } else {
        sendMsg(msg, 'how many?', command, args);
    }
}

const printDamageHelp = () => {
    return `**DAMAGE:**
            !d 3 BBC //3d when 4 is B, 5 is B and 6 is C`;
}

module.exports = {
    damage,
    printDamageHelp
}