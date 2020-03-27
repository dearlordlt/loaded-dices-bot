const { r, explode, decorateRoll } = require('../utils');
const { Rules } = require('../ajax-rules');

const spell = (args, command, sendMsg, msg) => {
    let roll = [...Array(3)].map(el => el = r());
    let debug = false;
    let dices = 3;

    if (args[0]) {
        roll = args[0].split('').map(el => el = parseInt(el));
        dices = args[0].split('').length;
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
    sendMsg(msg, line, command, args);
}

const printSpellHelp = () => {
    return `**SPELL:**
            !spell //rolls 3d spell roll`;
}

module.exports = {
    spell,
    printSpellHelp
}