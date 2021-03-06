const { r } = require('../utils');
const { Rules } = require('../ajax-rules');

const location = (args, command, sendMsg, msg) => {
  const roll = r();
  const line = `${roll} hits ${Rules.getLocation(roll)}`;
  sendMsg(msg, line, command, args);
};

const printLocationHelp = () => `
    **LOCATIONS**
            !l //roll unaimed location
            !sl 1 //1,2,3,4,5,6 represents head, body, l.arm, r.arm, l.leg, r.leg`;

module.exports = {
  location,
  printLocationHelp,
};
