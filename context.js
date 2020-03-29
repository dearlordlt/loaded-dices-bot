class Context {
  constructor() {
    this.messages = [];
  }

  push(msg) {
    this.messages.push(msg);
    if (this.messages.length > 3) this.messages.shift();
  }

  pop() {
    return this.messages.pop();
  }

  getLast() {
    return this.messages[this.messages.length - 1];
  }

  sendMsg(text) {
    if (this.messages.length > 0) {
      this.getLast().reply(text);
    }
  }
}

class ContextManager {
  constructor() {
    this.localUsersContext = {};
  }

  getUserContext(id) {
    if (!(id in this.localUsersContext)) this.localUsersContext[id] = new Context();

    return this.localUsersContext[id];
  }
}

const contextManager = new ContextManager();
module.exports = {
  contextManager,
  Context,
};
