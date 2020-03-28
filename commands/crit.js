const { r } = require('../utils');
const { Rules } = require('../ajax-rules');

const crit = (args, command, sendMsg, msg) => {
  const roll = r();
  const type = args[0]; // melee, ranged, spell
  const value = args[1]; // 3, 4, 17, 18

  if (type !== 'melee' && type !== 'ranged' && type !== 'spell') {
    sendMsg(msg, `unknown type: ${type}, must be melee, ranged or spell`, command, args);
  } else if (value !== '3' && value !== '4' && value !== '17' && value !== '18') {
    sendMsg(msg, `wrong value: ${value}, must be 3, 4, 17 or 18`, command, args);
  } else {
    let message = '';

    if (type === 'melee') {
      if (value > 16) message = Rules.getMeleeFortune(roll, value);
      if (value < 5) message = Rules.getMeleeMisfortune(roll, value);
    }

    if (type === 'ranged') {
      if (value > 16) message = Rules.getRangedFortune(roll, value);
      if (value < 5) message = Rules.getRangedMisfortune(roll, value);
    }

    if (type === 'spell') {
      if (value > 16) message = Rules.getMagicFortune(roll, value);
      if (value < 5) message = Rules.getMagicMisfortune(roll, value);
    }

    const line = `roll - ${roll}: ${message}`;
    sendMsg(msg, line, command, args);
  }
};

const printCritHelp = () => `
    **CRIT**
        !crit melee|ranged|spell 3|4|17|18`;

module.exports = {
  crit,
  printCritHelp,
};
