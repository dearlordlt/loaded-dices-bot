const { r } = require('../utils');
const { Rules } = require('../ajax-rules');

const location = (args, command, sendMsg, msg) => {
    const roll = r();
    let line = `${roll} hits ${Rules.getLocation(6)}`;
    sendMsg(msg, line, parsed.command, parsed.arguments);
}

module.exports = {
    location,
}