const printCalculationsHelp = () => `
    **STATS**
            !calc STA 11 //shows calculations for sta;`;

const calculations = (args, command, sendMsg, msg) => {
  const subCommand = args[0];

  if (subCommand && subCommand.toUpperCase() === 'STA' && parseInt(args[1], 10)) {
    const sta = parseInt(args[1], 10);
    const line = `1/3 STA = ${Math.ceil((sta * 2) / 3)}, 2/3 STA = ${Math.ceil(((sta * 2) / 3) * 2)}`;
    sendMsg(msg, line, command, args);
    return;
  }

  sendMsg(msg, printCalculationsHelp(), command, args);
};

module.exports = {
  calculations,
  printCalculationsHelp,
};
