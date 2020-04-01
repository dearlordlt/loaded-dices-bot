const { CharacterModel } = require('../models/player');

const printCalculationsHelp = () => `
    **STATS**
            !calc STA 11 //shows calculations for sta;`;

const calculations = (args, command, sendMsg, msg) => {
  const subCommand = args[0];

  if (subCommand && subCommand.toUpperCase() === 'STA' && parseInt(args[1], 10)) {
    const sta = parseInt(args[1], 10);
    const line = `Total HP: ${sta * 2}, 1/3 HP = ${Math.ceil((sta * 2) / 3)}, 2/3 HP = ${Math.ceil(((sta * 2) / 3) * 2)}, MAX Intoxication = ${Math.ceil(sta / 3)}`;
    sendMsg(msg, line, command, args);
    return;
  }

  if (subCommand && subCommand.toUpperCase() === 'STA') {
    CharacterModel.find({ playerId: msg.author.id }).then((data) => {
      if (!data || data.length < 1) {
        // eslint-disable-next-line no-console
        console.log('ERROR NOT FOUND', data, msg.author.id);
        return;
      }
      const { sta } = data.attr;
      const line = `**${data.name}**: with STA(${sta}) - Total HP: ${sta * 2},  1/3 HP = ${Math.ceil((sta * 2) / 3)}, 2/3 HP = ${Math.ceil(((sta * 2) / 3) * 2)}, MAX Intoxication = ${Math.ceil(sta / 3)}`;
      sendMsg(msg, line, command, args);
    });
    return;
  }

  sendMsg(msg, printCalculationsHelp(), command, args);
};

module.exports = {
  calculations,
  printCalculationsHelp,
};
