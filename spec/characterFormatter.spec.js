/* eslint-disable operator-linebreak */
/* eslint-disable no-undef */
/* eslint-disable no-console */
const { getCharacterFormatter } = require('../helpers/characterFormatter');

const newChar = () => ({
  playerId: 0,
  name: 'Test Char',
  attr: {
    str: 10,
    sta: 11,
    dex: 12,
    ref: 13,
    per: 14,
    will: 15,
  },
  combatSkills: [{
    name: 'bow', lvl: 2, masteries: '', attack: 'per', defense: '-',
  }, {
    name: 'evade', lvl: 1, masteries: '', attack: '-', defense: 'dex',
  }, {
    name: 'shield', lvl: 3, masteries: 'bash', attack: 'ref', defense: 'dex',
  }],
});

describe('CharacterFormatter', () => {
  describe('#getAttributesAsAscii()', () => {
    it('should format attributes as ascii table', () => {
      const char = getCharacterFormatter(newChar());
      const result = char.getAttributesAsAscii();

      const expectedResult =
`+-----+-----+-----+-----+-----+------+
| str | sta | dex | ref | per | will |
+-----+-----+-----+-----+-----+------+
| 10  | 11  | 12  | 13  | 14  |  15  |
+-----+-----+-----+-----+-----+------+`;
      expect(result).toBe(expectedResult);
    });
  });

  describe('#getCombatSkillsAsAscii()', () => {
    it('should format combat skills as ascii table', () => {
      const char = getCharacterFormatter(newChar());
      const result = char.getCombatSkillsAsAscii();

      const expectedResult =
`+---------+-----+---------------------+---------------+----------+-----+-----------------------+---------------+
|  skill  | lvl |      defaults       |   masteries   |  skill   | lvl |       defaults        |   masteries   |
+---------+-----+---------------------+---------------+----------+-----+-----------------------+---------------+
|   bow   |  2  |    a=[per] d=[-]    |               |  evade   |  1  |     a=[-] d=[dex]     |               |
+---------+-----+---------------------+---------------+----------+-----+-----------------------+---------------+
|         |     |                     |               |  shield  |  3  |    a=[ref] d=[dex]    |     bash      |
+---------+-----+---------------------+---------------+----------+-----+-----------------------+---------------+`;
      expect(result).toBe(expectedResult);
    });
  });

  describe('#getAttributesAsMarkdown()', () => {
    it('should format attributes as md table', () => {
      const char = getCharacterFormatter(newChar());
      const result = char.getAttributesAsMarkdown();

      const expectedResult =
`| str | sta | dex | ref | per | will |
| --- | --- | --- | --- | --- | ---- |
| 10  | 11  | 12  | 13  | 14  | 15   |`;
      expect(result).toBe(expectedResult);
    });
  });
  describe('#getCombatSkillsAsMarkdown()', () => {
    it('should format combat skills as markdown table', () => {
      const char = getCharacterFormatter(newChar());
      const result = char.getCombatSkillsAsMarkdown();

      const expectedResult =
`| skill | lvl | defaults      | masteries | skill  | lvl | defaults        | masteries |
| ----- | --- | ------------- | --------- | ------ | --- | --------------- | --------- |
| bow   | 2   | a=[per] d=[-] |           | evade  | 1   | a=[-] d=[dex]   |           |
|       |     |               |           | shield | 3   | a=[ref] d=[dex] | bash      |`;
      expect(result).toBe(expectedResult);
    });
  });
});
