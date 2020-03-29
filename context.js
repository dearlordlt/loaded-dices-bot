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
