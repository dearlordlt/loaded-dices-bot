const { Environment } = require('../ajax-env.js');

let environment = new Environment();

const environmentCommandHandler = (msg) => {
  const args = msg.content.match(/!env\s*((autofail\s(\d+))*(clear)*(list)*)\s*/i);
  if (args) {
    if (args[1] === 'clear') {
      environment = new Environment();
      msg.reply('environment restored to default values');
    } else if (args[1] === '') {
      msg.reply(`**environment**\nautofail=${environment.autofail}`);
    } else {
      environment.autofail = parseInt(args[3], 10);
      msg.reply(`autofail=${environment.autofail}`);
    }
  }
};

module.exports = {
  environmentCommandHandler,
};
