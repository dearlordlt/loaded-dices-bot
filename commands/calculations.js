const { CharacterModel } = require('../models/player');

const printCalculationsHelp = () => `
    **STATS**
            !calc STA 11 //shows calculations for sta;`;

const getCharInfo = async (sendMsg, msg, id) => {
  const data = await CharacterModel.findOne({ playerId: id }, (err, characterData) => {
    if (err) {
      sendMsg(msg, 'err');
    }
    return characterData;
  });
  return data;
};

const calculations = (args, command, sendMsg, msg) => {
  const subCommand = args[0];

  if (subCommand && subCommand.toUpperCase() === 'STA' && parseInt(args[1], 10)) {
    const sta = parseInt(args[1], 10);
    const line = `1/3 STA = ${Math.ceil((sta * 2) / 3)}, 2/3 STA = ${Math.ceil(((sta * 2) / 3) * 2)}, MAX Intoxication = ${Math.ceil(sta / 3)}`;
    sendMsg(msg, line, command, args);
    return;
  }

  if (subCommand && subCommand.toUpperCase() === 'STA') {
    const charData = getCharInfo(sendMsg, msg, msg.author.id);
    const { sta } = charData.attr;
    const line = `**${charData.name}**: 1/3 STA = ${Math.ceil((sta * 2) / 3)}, 2/3 STA = ${Math.ceil(((sta * 2) / 3) * 2)}, MAX Intoxication = ${Math.ceil(sta / 3)}`;
    sendMsg(msg, line, command, args);
    return;
  }

  sendMsg(msg, printCalculationsHelp(), command, args);
};

module.exports = {
  calculations,
  printCalculationsHelp,
};
