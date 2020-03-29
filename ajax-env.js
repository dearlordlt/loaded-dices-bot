class Environment {
  constructor() {
    this.autofail = 7;
  }

  reset() {
    this.autofail = 7;
  }
}
const environment = new Environment();
module.exports = {
  environment,
};
