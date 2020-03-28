const { r } = require('../utils');
const { Rules } = require('../ajax-rules');

const sublocation = (args, command, sendMsg, msg) => {
  const roll = r();
  const location = parseInt(args[0], 10) || 1;

  if (location < 1 || location > 6) {
    sendMsg(msg, 'please set location (1,2,3,4,5,6)', command, args);
  } else {
    const locationStr = Rules.locations[location - 1];

    const line = `${roll} hits ${Rules.getSubLocation(roll, locationStr)}`;
    sendMsg(msg, line, command, args);
  }
};

module.exports = {
  sublocation,
};
