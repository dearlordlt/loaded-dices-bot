const { r, explode, decorateRoll } = require('../utils');

const social = (args, command, sendMsg, msg) => {
    const dices = parseInt(args[0]);
    const effectiveness = parseInt(args[1]) || 4;

    if (dices > 0) {
        let roll = [...Array(dices)].map(el => el = r());

        roll = [...roll, ...explode(roll)];

        const botchDice = roll.filter(el => el === 1).length;
        const successDice = roll.filter(el => el >= effectiveness).length;

        let message = botchDice >= dices / 2 ? '**botch**' : `success ${successDice >= dices ? '***skill increase!***' : ''}`;

        let line = `roll ${dices}d: [${decorateRoll(roll, dices)}] = ${successDice}; ${message} with effectiveness of ${effectiveness}`;
        sendMsg(msg, line, command, args);
    } else {
        sendMsg(msg, 'how many?', command, args);
    }
}

const printSocialHelp = () => {
    return `**SOCIAL:**
            !s 5 4 //5d6 when 4 and more is success
            !s 3 //3d6 when 4 and more is success`;
}

module.exports = {
    social,
    printSocialHelp
}