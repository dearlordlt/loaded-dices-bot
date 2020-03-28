// eslint-disable-next-line max-classes-per-file
const fs = require('fs');

const { MessageAttachment } = require('discord.js');
const { sendMsg } = require('../utils');
const { PlayerModel } = require('../models/player');

class Player {
  constructor(playerId, name) {
    this.name = name;
    this.playerId = playerId;
    this.model = null;

    PlayerModel.findOne({ playerId, name }, (err, player) => {
      if (player == null) {
        // eslint-disable-next-line no-console
        console.log('player not found, creating new one');
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
        PlayerModel.create(this.model, () => {
          // saved!
        });
      } else {
        // eslint-disable-next-line no-console
        console.log('polayer loaded from mongodb');
        this.model = player;
      }
    });
  }

  print() {
    return `
      ${this.printAttr().trim()}
      ${this.printCombatSkills().trim()}`;
  }

  printAttr() {
    if (this.model) {
      return `
        **ATTRIBUTES**
            str:${this.model.attr.str}
            sta:${this.model.attr.sta}
            dex:${this.model.attr.dex}
            ref:${this.model.attr.ref}
            per:${this.model.attr.per}
            will:${this.model.attr.will}`;
    }
    return '**ATTRIBUTES**';
  }

  printCombatSkills() {
    let lines = '**COMBAT SKILLS**\n';
    if (this.model && this.model.combatSkills) {
      this.model.combatSkills.forEach((skill) => lines = `${lines}\n ${skill.name}=${skill.lvl} attack=${skill.attack} defense=${skill.defense}`);
    }
    return lines;
  }

  setAttr(name, value) {
    this.model.attr[name] = value;
  }

  // eslint-disable-next-line class-methods-use-this
  help() {
    return `
        **PLAYER**
            !p print //prints player info
            !p download //downloads player info as json file
            !p sta 11 //sets attr sta to 11
            !p sta //prints all attributes
            !p c[ombat] bow //prints bow skill
            !p c[ombat] bow 3 [a=ref] [d=dex]//sets bow skill to lvl 3 default attack attribute to ref and defense attribute to dex
            !p c[ombat] bow 3 a=per //set bow skill to lvl 3 and attack attribute to per
            !p c[ombat] boxing 2 d=sta//set boxing skill to lvl 2 and defense attribute to sta`;
  }

  save() {
    PlayerModel.updateOne({ playerId: this.playerId, name: this.name }, this.model, () => {

    });
  }

  handleDownloadFile(msg) {
    const buffer = fs.readFileSync(this.fileName);
    /**
     * Create the attachment using MessageAttachment,
     * overwritting the default file name to 'memes.txt'
     * Read more about it over at
     * http://discord.js.org/#/docs/main/master/class/MessageAttachment
     */
    const attachment = new MessageAttachment(buffer, `${this.name}.json`);
    msg.channel.send(`${msg.author}, your char file!`, attachment)
      .then((m) => {
        m.delete(10000);
      });
  }

  handle(msg) {
    if ((this.handleAttr(msg)
      || this.handleCombatSkills(msg)
      || this.handleSubcommands(msg)
    ) === false) {
      sendMsg(msg, this.help());
    }
  }

  handleSubcommands(msg) {
    const args = msg.content.match(/!p\s+(print|save)\s*/i);
    if (!args) return false;
    switch (args[1]) {
      case 'print':
        sendMsg(msg, this.print());
        break;
      case 'save':
        this.handleSave(msg);
        break;
      default:
        return false;
    }

    return true;
  }

  handleAttr(msg) {
    const args = msg.content.match(/!p\s*(str|sta|dex|ref|per|will)\s*(\d*)/i);
    if (!args) return false;
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
    const skill = this.model.combatSkills.find((el) => el.name === name);
    return skill || {
      name,
      lvl: 0,
      attack: 'ref',
      defense: 'dex',
    };
  }

  removeCombatSkill(name) {
    this.model.combatSkills = this.model.combatSkills.filter((el) => el.name !== name);
  }

  handleCombatSkills(msg) {
    const args = msg.content.match(/!p\s+(combat|c)(\s+(add|remove)*\s*(\S+)\s*((\d+)\s*(a=(\S+))*\s*(d=(\S+))*)*)*/i);
    if (!args) return false;
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
  PlayerModel,
};
