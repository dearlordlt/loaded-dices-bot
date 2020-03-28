const { sendMsg } = require('../utils');

class Variables {
  constructor() {
    this.localVariablesMap = {};
  }

  // eslint-disable-next-line class-methods-use-this
  help() {
    return `**VAR:**
            !var bow 18 //sets bow to 18 for user
            !c bow //rolls 3d + bow
            !var list //list all variables for user
            !var clear //clear all variable for user
            !var bow //removes only bow variable`;
  }

  getVariable(author, varName) {
    if (author in this.localVariablesMap) {
      if (varName in this.localVariablesMap[author]) {
        return this.localVariablesMap[author][varName];
      }
    }
    return 0;
  }

  handle(msg) {
    const author = msg.author.id;

    if (!(author in this.localVariablesMap)) this.localVariablesMap[author] = {};
    let args = msg.content.match(/!var\s*((list)*(clear)*)\s*/i);
    if (args) {
      if (args[1] === 'list') {
        let lines = '';
        const myVars = this.localVariablesMap[author];
        Object.keys(myVars).forEach((e) => lines = `${lines}\n ${e}=${myVars[e]}`);
        msg.reply(`**Variables:**\n${lines}`);
        return;
      }
      if (args[1] === 'clear') {
        delete this.localVariablesMap[author];
        sendMsg(msg, 'all variables cleared');
        return;
      }
    }
    args = msg.content.match(/!var\s*([a-z]+[0-9]*)(\[(\d+)\])*\s*(\d*)\s*([+-]{2}(\d*))*/i);
    if (args) {
      if (args[4]) {
        let cnt = 0;
        let r = 0;

        if (args[3]) cnt = parseInt(args[3], 10);
        if (args[6]) r = parseInt(args[6], 10);

        const val = parseInt(args[4], 10);

        if (cnt === 0) {
          this.localVariablesMap[author][args[1]] = this.modValue(val, r);
          sendMsg(msg, `added ${args[1]}=${this.localVariablesMap[author][args[1]]}`);
        } else {
          for (let idx = 1; idx <= cnt; idx++) {
            const name = args[1] + idx;
            this.localVariablesMap[author][name] = this.modValue(val, r);
            sendMsg(msg, `added ${name}=${this.localVariablesMap[author][name]}`);
          }
        }
      } else if (args[1] in this.localVariablesMap[author]) {
        delete this.localVariablesMap[author][args[1]];
        sendMsg(msg, `removed ${args[1]}`);
      }
      return;
    }
    // print help
    sendMsg(msg, this.help());
  }

  // eslint-disable-next-line class-methods-use-this
  modValue(value, r) {
    return value + Math.round(Math.random() * r * 2) - r;
  }
}

const variables = new Variables();
module.exports = {
  variables,
};
