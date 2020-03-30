const { r, explode, decorateRoll } = require('../utils');

const rolls = [];

const social = (args, command, sendMsg, msg, rerollDice = 0) => {
  const dices = parseInt(args[0], 10);
  const effectiveness = parseInt(args[1], 10) || 4;

  if (dices > 0) {
    let roll = [];
    if (!rerollDice) {
      roll = [...Array(dices)].map(() => r());
    } else {
      if (!rolls) {
        sendMsg(msg, 'no recent rolls to reroll', command, args);
        return;
      }
      roll = rolls.find((el) => el === msg.author.id).pop().roll;
      const newDice = [];
      for (let i = 0; i < rerollDice; i++) {
        newDice.push(r());
        const min = Math.min(...roll);
        roll.filter((el) => el === min);
      }
      roll = [...roll, newDice];
    }

    if (!roll.some((el) => el === 1)) {
      roll = [...roll, ...explode(roll)];
    }

    rolls.push({ id: msg.author.id, roll, effectiveness });

    // eslint-disable-next-line no-console
    console.dir(rolls);

    const botchDice = roll.filter((el) => el === 1).length;
    const successDice = roll.filter((el) => el >= effectiveness).length;

    const message = (botchDice >= dices / 2 && roll.some((el) => el === 1)) ? '**botch**' : `success ${successDice >= dices ? '***skill increase!***' : ''} ${rerollDice ? 'This is luck roll' : ''}`;

    const line = `roll ${dices}d: [${decorateRoll(roll, dices, effectiveness)}] = ${successDice}; ${message} with effectiveness of ${effectiveness}`;
    sendMsg(msg, line, command, args);
  } else if (args[0] === 'luck' && parseInt(args[1], 10) > 0) {
    social(args, command, sendMsg, msg, args[0]);
  } else if (args[0] === 'log') {
    sendMsg(msg, `your recent rolls: ${rolls}`, command, args);
  } else {
    sendMsg(msg, 'how many?', command, args);
  }
};

const printSocialHelp = () => `
    **SOCIAL:**
            !s 5 4 //5d6 when 4 and more is success
            !s 3 //3d6 when 4 and more is success
            !s luck 2 //rerolls 2 lowest dice in last players roll
            !s log //shows recent rolls log`;

module.exports = {
  social,
  printSocialHelp,
};
