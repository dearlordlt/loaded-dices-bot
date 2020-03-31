const { r } = require('../utils');

const damageMap = [
  { damage: 'T', base: 1, shock: 3 },
  { damage: 'B', base: 2, shock: 0 },
  { damage: 'C', base: 3, shock: 1 },
];

const resolveSHockAndBaseDmg = (effect) => {
  const dmg = damageMap.find((el) => el.damage.toLowerCase() === effect.toLowerCase());
  return dmg;
};

const printDamageMsg = (baseDamage, shock) => `Blow does **${baseDamage}** dmg and **${shock}** shock`;

const decorateDamageRoll = (roll, ln) => roll.map((el) => {
  if (el > ln) {
    return `**${el}**`;
  }
  return `~~${el}~~`;
});

const damage = (args, command, sendMsg, msg) => {
  const dices = parseInt(args[0], 10);

  if (!args[1]) {
    const line = 'choose effects, a.e. !d 3 BBT';
    sendMsg(msg, line, command, args);
    return;
  }

  const damageArr = args[1].split('');

  if (dices > 0) {
    const arr6 = [...Array(6)].map(() => damageArr.pop() || '').reverse();
    const reply = [];
    const effects = [];
    let shock = 0;
    let baseDamage = 0;
    for (let i = 0; i < dices; i++) {
      const roll = r();
      const effect = arr6[roll - 1];
      const resolve = resolveSHockAndBaseDmg(effect) || false;
      if (resolve.damage && effect) {
        shock += resolve.shock || 0;
        baseDamage += resolve.base || 0;
      }
      if (effect) {
        effects.push(effect);
      }
      reply.push(roll);
    }
    const line = `roll ${dices}d and damage ${args[1]}: Result (${effects}), Roll (${decorateDamageRoll(reply, (6 - args[1].split('').length))}), ${printDamageMsg(baseDamage, shock)}`;
    sendMsg(msg, line, command, args);
  } else {
    sendMsg(msg, 'how many?', command, args);
  }
};

const printDamageHelp = () => `
    **DAMAGE:**
            !d 3 BBC //3d when 4 is B, 5 is B and 6 is C`;

module.exports = {
  damage,
  printDamageHelp,
};
