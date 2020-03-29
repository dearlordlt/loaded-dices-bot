const { r, decorateRoll } = require('../utils');

const printDeterminationHelp = () => `
    **DETERMINATION**
            !de 7 3 //rolls 7 determination dices vs 3 difficulty;`;

const determination = (args, command, sendMsg, msg) => {
  const dices = parseInt(args[0], 10);
  const diff = parseInt(args[1], 10);

  if (dices > 0 && diff > 0) {
    const roll = [...Array(dices)].map(() => r());

    const successDice = roll.filter((el) => el >= 4).length;

    const line = `roll ${dices}d: [${decorateRoll(roll, dices)}] = ${successDice}; ${(successDice >= diff) ? '**succeeded**' : '**failed**'}`;
    sendMsg(msg, line, command, args);
  } else {
    sendMsg(msg, `${printDeterminationHelp()}`, command, args);
  }
};

module.exports = {
  determination,
  printDeterminationHelp,
};
