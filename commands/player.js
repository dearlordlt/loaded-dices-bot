/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
// eslint-disable-next-line max-classes-per-file
const { contextManager } = require('../context');
const { sendMsg } = require('../utils');
const { CharacterModel } = require('../models/player');
const { getCharacterFormatter } = require('../helpers/characterFormatter');

const nullSkill = () => ({
  name: '',
  lvl: 0,
  attack: 'ref',
  defense: 'dex',
});

class Player {
  constructor(playerId, name) {
    this.name = name;
    this.playerId = playerId;
    this.model = null;
  }

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line class-methods-use-this
  checkMongooseError(err, msg = 'failed to communicate with DB') {
    if (err) {
      contextManager.getUserContext(this.playerId).sendMsg(`${this.name}, ${msg}!\n ${err}`);
      return false;
    }
    return true;
  }

  handleCreateChar(msg, name) {
    this.model = {
      playerId: this.playerId,
      name: this.name,
      attr: {
        str: 10,
        sta: 10,
        dex: 10,
        ref: 10,
        per: 10,
        will: 10,
      },
      combatSkills: [],
    };
    CharacterModel.findOneAndDelete({ playerId: this.playerId, name }, (err) => {
      this.checkMongooseError(err);
      CharacterModel.create(this.model, (saveErr) => {
        this.checkMongooseError(saveErr, 'failed to save char');
        msg.reply(`character created name=${this.name}`);
      });
    });
  }

  handleLoadChar(msg, name) {
    CharacterModel.findOne({ playerId: this.playerId, name }, (err, player) => {
      if (this.checkMongooseError(err)) {
        if (player == null) {
          msg.reply(`character with name ${name} not found for current player`);
        } else {
          // eslint-disable-next-line no-console
          this.model = player;
          msg.reply(this.print());
        }
      }
    });
  }

  print() {
    if (this.isModelLoaded()) {
      return `https://loaded-dice-bot.herokuapp.com/characters/${this.playerId}`;
    }

    return '**no character loaded**';
  }

  modelNotLoadedError() {
    if (this.isModelLoaded()) {
      return false;
    }
    contextManager.getUserContext(this.playerId).sendMsg('**no character loaded**');
    return true;
  }

  isModelLoaded() {
    if (this.model) return true;
    return false;
  }

  printAttr() {
    return `**ATTRIBUTES**\n\`\`\`asciidoc\n${getCharacterFormatter(this.model).getAttributesAsAscii()}\n\`\`\``;
  }


  printCombatSkills() {
    return `**COMBAT SKILLS**\n\`\`\`asciidoc\n${getCharacterFormatter(this.model).getCombatSkillsAsAscii()}\n\`\`\``;
  }

  setAttr(name, value) {
    if (this.isModelLoaded()) this.model.attr[name] = value;
  }

  // eslint-disable-next-line class-methods-use-this
  help() {
    return `
        **PLAYER**
            !p print [attr] [combat]//prints player info
            !p load //loads char
            !p create //creates new char
            !p sta 11 //sets attr sta to 11
            !p sta //prints all attributes
            !p c[ombat] bow //prints bow skill
            !p c[ombat] bow 3 [a=ref] [d=dex]//sets bow skill to lvl 3 default attack attribute to ref and defense attribute to dex
            !p c[ombat] bow 3 a=per //set bow skill to lvl 3 and attack attribute to per
            !p c[ombat] boxing 2 d=sta//set boxing skill to lvl 2 and defense attribute to sta`;
  }

  save() {
    CharacterModel.updateOne({ playerId: this.playerId, name: this.name }, this.model, (err) => {
      this.checkMongooseError(err, 'failed to save char');
    });
  }


  handle(msg) {
    if ((this.handleSubcommands(msg)
      || this.handleAttr(msg)
      || this.handleCombatSkills(msg)
    ) === false) {
      sendMsg(msg, this.help());
    }
  }

  handleSubcommands(msg) {
    const args = msg.content.match(/!p\s+(print|save|load|create)\s*(\S+)*/i);
    if (!args) return false;
    const secondCommand = args[2] || 'none';

    switch (args[1]) {
      case 'print':
        if (this.modelNotLoadedError()) break;
        switch (secondCommand) {
          case 'attr':
            sendMsg(msg, this.printAttr());
            break;
          case 'combat':
            sendMsg(msg, this.printCombatSkills());
            break;
          default:
            sendMsg(msg, this.print());
            break;
        }
        break;

      case 'load':
        this.handleLoadChar(msg, this.name);
        break;
      case 'create':
        this.handleCreateChar(msg, this.name);
        break;
      default:
        return false;
    }

    return true;
  }

  handleAttr(msg) {
    const args = msg.content.match(/!p\s*(str|sta|dex|ref|per|will)\s*(\d*)/i);
    if (!args) return false;
    if (this.modelNotLoadedError()) return true;
    if (args[1] && args[2]) {
      this.setAttr(args[1], parseInt(args[2], 10));
      this.save();
      sendMsg(msg, `${args[1]}=${args[2]}`);
    } else {
      sendMsg(msg, this.printAttr());
    }
    return true;
  }

  getCombatSkillValue(name, actionType) {
    const skill = this.getCombatSkill(name);
    if (skill.lvl > 0) {
      if (actionType in skill) return this.model.attr[skill[actionType]] + skill.lvl;
    }
    return 0;
  }

  getCombatSkillDescription(name, actionType) {
    const skill = this.getCombatSkill(name);
    if (skill.lvl > 0) {
      if (actionType in skill) return `${skill[actionType]}:${this.model.attr[skill[actionType]]} + ${skill.lvl}=${this.model.attr[skill[actionType]] + skill.lvl}`;
    }
    return '';
  }

  getOrCreateCombatSkill(name) {
    let skill = this.model.combatSkills.find((el) => el.name === name);
    if (!skill) {
      skill = {
        name,
        lvl: 0,
        attack: 'ref',
        defense: 'dex',
      };
      this.model.combatSkills.push(skill);
    }
    return skill;
  }


  getCombatSkill(name) {
    if (this.model) {
      const skill = this.model.combatSkills.find((el) => el.name === name);
      return skill || nullSkill();
    }

    return nullSkill();
  }

  removeCombatSkill(name) {
    this.model.combatSkills = this.model.combatSkills.filter((el) => el.name !== name);
  }

  handleCombatSkills(msg) {
    const args = msg.content.match(/!p\s+(combat|c)(\s+(add|remove)*\s*(\S+)\s*((\d+)\s*(a=(\S+))*\s*(d=(\S+))*)*)*/i);
    if (!args) return false;
    if (this.modelNotLoadedError()) return true;

    const name = args[4];
    const lvl = args[6];
    const a = args[8];
    const d = args[10];
    const command = args[3] || 'add';
    if (name && lvl && command === 'add') {
      // nurodytas skill name ir lvl
      const skill = this.getOrCreateCombatSkill(name);
      skill.lvl = parseInt(lvl, 10);
      if (a) skill.attack = a;
      if (d) skill.defense = d;
      this.save();
      sendMsg(msg, `combat skill ${name}=${skill.lvl} attack=${skill.attack} defense=${skill.defense}`);
    } else if (name && command === 'remove') {
      this.removeCombatSkill(name);
      this.save();
      sendMsg(msg, `combat skill ${name} removed`);
    } else if (name) {
      const skill = this.getCombatSkill(name);
      sendMsg(msg, `combat skill ${name}=${skill.lvl} attack=${skill.attack} defense=${skill.defense}`);
    } else {
      sendMsg(msg, this.printCombatSkills());
    }
    return true;
  }
}

class PlayerManager {
  constructor() {
    this.localPlayers = {};
  }

  getPlayer(id, name) {
    if (!(id in this.localPlayers)) {
      this.localPlayers[id] = new Player(id, name);
    }

    return this.localPlayers[id];
  }
}

module.exports = {
  Player,
  playerManager: new PlayerManager(),
  nullSkill,
};
