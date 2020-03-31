const { r, explode, decorateRoll } = require('../utils');

const rolls = [];

const social = (args, command, sendMsg, msg) => {
  const dices = parseInt(args[0], 10);
  const effectiveness = parseInt(args[1], 10) || 4;

  if (dices > 0) {
    /* SOCIAL ROLL */
    let roll = [];
    let botch = false;

    roll = [...Array(dices)].map(() => r());

    if (!roll.some((el) => el === 1)) {
      roll = [...roll, ...explode(roll)];
    } else {
      const botchNum = roll.filter((el) => el === 1).length;
      const successNum = roll.filter((el) => el >= effectiveness).length;
      if (botchNum >= successNum) {
        botch = true;
      }
    }

    rolls.push({
      id: msg.author.id, roll, effectiveness, dices,
    });

    const successDice = roll.filter((el) => el >= effectiveness).length;
    const message = (botch) ? '**botch**' : `success ${successDice >= dices ? '***skill increase!***' : ''}`;

    const line = `roll ${dices}d: [${decorateRoll(roll, dices, effectiveness)}] = ${successDice}; ${message} with effectiveness of ${effectiveness}`;

    sendMsg(msg, line, command, args);
    /* END SOCIAL ROLL */
  } else if (args[0] === 'luck' && parseInt(args[1], 10) > 0) {
    /* @TODO: implement luck */
    sendMsg(msg, 'not implemented yet', command, args);
  } else if (args[0] === 'log') {
    let rollLog = '';
    rolls.forEach((el) => {
      if (el.id === msg.author.id) {
        rollLog += `${decorateRoll(el.roll, el.dices, el.effectiveness)} - ${el.dices}d - ${el.effectiveness} effectiveness;
        `;
      }
    })
    sendMsg(msg, `your recent rolls: ${rollLog}`, command, args);
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
