const { r, explode, decorateRoll } = require('../utils');

const rolls = [];

const social = (args, command, sendMsg, msg, rerollDice = 0) => {
  let dices = parseInt(args[0], 10);
  const effectiveness = parseInt(args[1], 10) || 4;

  if (dices > 0) {
    let roll = [];
    let botch = false;
    if (!rerollDice) {
      roll = [...Array(dices)].map(() => r());
    } else {
      const rollsByUser = rolls.filter((el) => el.id === msg.author.id);
      if (!rollsByUser.length) {
        sendMsg(msg, 'no recent rolls to reroll', command, args);
        return;
      }
      roll = rollsByUser.pop().roll; // get last roll from user rolls
      dices = roll.length;
      const newDice = [];
      for (let i = 0; i < rerollDice; i++) {
        newDice.push(r());
        const min = Math.min(...roll);
        const index = roll.indexOf(min);
        if (index > -1) {
          roll.splice(index, 1);
        }
      }
      roll = [...roll, newDice];
    }

    if (!roll.some((el) => el === 1)) {
      roll = [...roll, ...explode(roll)];
    } else {
      const botchNum = roll.filter((el) => el === 1).length;
      const successNum = roll.filter((el) => el >= effectiveness).length;
      if (botchNum >= successNum) {
        botch = true;
      }
    }

    rolls.push({ id: msg.author.id, roll, effectiveness });

    const successDice = roll.filter((el) => el >= effectiveness).length;

    const message = (botch) ? '**botch**' : `success ${successDice >= dices ? '***skill increase!***' : ''} ${rerollDice ? 'This is luck roll' : ''}`;

    const line = `roll ${dices}d: [${decorateRoll(roll, dices, effectiveness)}] = ${successDice}; ${message} with effectiveness of ${effectiveness}`;
    sendMsg(msg, line, command, args);
    if (rerollDice) {
      // eslint-disable-next-line no-useless-return
      return;
    }
  } else if (args[0] === 'luck' && parseInt(args[1], 10) > 0 && !rerollDice) {
    /* social(
      [parseInt(args[1], 10), rolls[rolls.length.effectiveness]],
      command,
      sendMsg,
      msg,
      args[1],
    ); */
    sendMsg(msg, 'not implemented yet', command, args);
  } else if (args[0] === 'log') {
    sendMsg(msg, `your recent rolls: ${JSON.stringify(rolls)}`, command, args);
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
