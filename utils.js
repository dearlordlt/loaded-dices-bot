/* eslint-disable no-console */
const r = () => Math.ceil(Math.random() * 6);

const decorateRoll = (roll, dices = 3) => {
  // eslint-disable-next-line no-param-reassign
  roll = roll.map((el, index) => {
    if (index >= dices) {
      return `**${el}**`;
    }
    if (el === 6) {
      return `__${el}__`;
    }
    if (el === 1) {
      return `~~${el}~~`;
    }

    return el;
  });
  return roll;
};
const disc = () => ({
  client: null,
});
const explode = (arr) => {
  let newArr = [...Array(arr.filter((el) => el === 6).length)].map(() => r());
  if (newArr.some((el) => el === 6)) {
    newArr = [...newArr, ...explode(newArr)];
  }
  return newArr;
};

const sendMsg = (msg, line, command = '', args = []) => {
  msg.reply(line);
  console.log(line, command, args);
};

const printEnvHelp = () => `
  **ENVIRONMENT**
            !env //prints current environment
            !env clear //restores default
            !env autofail 9 //sets autofail to 9`;

const printOtherHelp = () => `
  **OTHER:**
            !rules //links to resources`;

module.exports = {
  r,
  decorateRoll,
  explode,
  sendMsg,
  printEnvHelp,
  printOtherHelp,
  disc,
};
