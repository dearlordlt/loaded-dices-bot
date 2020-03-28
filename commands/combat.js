/* eslint-disable radix */
const { r, decorateRoll, sendMsg } = require('../utils');
const { variables } = require('./variables');
const { playerManager } = require('../playerManager');

const combat = {
  handle(msg, environment) {
    const args = msg.content.match(/!c\s*(\d*)*\s*((my.)?([a-z0-9]+))?\s*([+-])?\s*(\d*)?/i);
    const dices = parseInt(args[1] || '3');
    const varPrefix = args[3];
    const variable = args[4] || '<not exists>';
    // const sign = (args[5] === '-') ? -1 : 1; //unused
    let mod = parseInt(args[6] || '0');
    mod *= mod;

    if (dices > 0) {
      let bonus = 0;
      if (varPrefix) {
        const player = playerManager.getPlayer(msg.author.id);
        bonus = player.getCombatSkillValue(variable, 'attack');
        if (bonus !== 0) {
          sendMsg(msg, `using my ${variable}=${player.getCombatSkillDescription(variable, 'attack')}`);
          mod += bonus;
        }
      } else {
        bonus = variables.getVariable(msg.author.id, variable);
        if (bonus !== 0) {
          sendMsg(msg, `using ${variable}=${bonus}`);
          mod += bonus;
        }
      }

      // eslint-disable-next-line no-unused-vars
      const roll = [...Array(dices)].map(() => r());
      const initialRollSum = roll.reduce((a, b) => a + b, 0);
      let line = `roll: [${decorateRoll(roll, dices)}] = ${initialRollSum}`;
      if (initialRollSum > 16) {
        line = `${line} **critical success !!!** `;
      }
      if (initialRollSum < 5) {
        line = `${line} **critical failure !!!** `;
      }

      if (initialRollSum <= environment.autofail) {
        line = `${line} **autofail**`;
        sendMsg(msg, line);
        return;
      }

      if (mod !== 0) { line = `${line} ${(mod > 0) ? `+${mod}` : mod}=${initialRollSum + mod}`; }

      sendMsg(msg, line);
    } else {
      sendMsg(msg, 'how many?');
    }
  },
  help() {
    return `**COMBAT:**
            !c 3 + 10 //3d6 + 10
            !c + 10 //3d6 + 10
            !c //3d6`;
  },
};
module.exports = {
  combat,
};
