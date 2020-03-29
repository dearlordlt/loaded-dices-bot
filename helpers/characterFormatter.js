/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
const WordTable = require('word-table');
const table = require('markdown-table');

class CharacterFormatter {
  constructor(character) {
    this.char = character;
  }

  getAttributesAsAscii() {
    const wt = new WordTable(['str', 'sta', 'dex', 'ref', 'per', 'will'],
      [[this.char.attr.str, this.char.attr.sta, this.char.attr.dex,
        this.char.attr.ref, this.char.attr.per, this.char.attr.will]]);

    return wt.string();
  }

  getAttributesAsMarkdown() {
    return table([
      ['str', 'sta', 'dex', 'ref', 'per', 'will'],
      [this.char.attr.str, this.char.attr.sta, this.char.attr.dex,
        this.char.attr.ref, this.char.attr.per, this.char.attr.will]
    ]);
  }

  getCombatSkillsAsAscii() {
    const groupBy = (xs) => xs.reduce((rv, x, idx) => {
      const i = Math.floor(idx / 2);
      const el = (rv[i] || ['', '', '', '']);
      el.push(x);
      rv[i] = el.flat();
      if (rv[i].length > 8) rv[i] = rv[i].slice(4, 11);

      return rv;
    }, []);
    const rows = groupBy(this.char.combatSkills.map((skill) => [skill.name, skill.lvl, `a=[${skill.attack}] d=[${skill.defense}]`, skill.masteries]));
    const wt = new WordTable(['skill', 'lvl', 'defaults', 'masteries', 'skill', 'lvl', 'defaults', 'masteries'],
      rows);

    return wt.string();
  }
}
const getCharacterFormatter = (character) => new CharacterFormatter(character);
module.exports = {
  getCharacterFormatter,
};
