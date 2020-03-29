/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
// eslint-disable-next-line max-classes-per-file
// const { MessageAttachment } = require('discord.js');

const { sendMsg, disc } = require('../utils');
// const { MessageAttachment } = require('discord.js');
const { CharacterModel } = require('../models/player');
const { CharacterFormater } = require('../helpers/characterFormatter');

class Player {
  constructor(playerId, name) {
    this.name = name;
    this.playerId = playerId;
    this.model = null;
  }

  checkMongooseError(err, msg = 'failed to communicate with DB') {
    if (err) {
      disc.client.send(`${this.name}, ${msg}!\n ${err}`);
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
          msg.reply(`character with name ${name} not found forcurrent player`);
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
      return `
        ${this.printAttr().trim()}
        ${this.printCombatSkills().trim()}`;
    }

    return '**no character loaded**';
  }

  isModelLoaded() {
    if (this.model) return true;
    return false;
  }

  printAttr() {
    return `**ATTRIBUTES**\n\`\`\`asciidoc\n${new CharacterFormater(this.model).getAttributesAsAscii()}\n\`\`\``;
  }


  printCombatSkills() {
    return `**COMBAT SKILLS**\n\`\`\`asciidoc\n${new CharacterFormater(this.model).getCombatSkillsAsAscii()}\n\`\`\``;
  }

  setAttr(name, value) {
    if (this.isModelLoaded()) this.model.attr[name] = value;
  }

  // eslint-disable-next-line class-methods-use-this
  help() {
    return `
        **PLAYER**
            !p print //prints player info
            !p download //downloads player info as json file
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

  // handleDownloadFile(msg) {
  //   // const buffer = fs.readFileSync(this.fileName);
  //   // /**
  //   //  * Create the attachment using MessageAttachment,
  //   //  * overwritting the default file name to 'memes.txt'
  //   //  * Read more about it over at
  //   //  * http://discord.js.org/#/docs/main/master/class/MessageAttachment
  //   //  */
  //   // const attachment = new MessageAttachment(buffer, `${this.name}.json`);
  //   // msg.channel.send(`${msg.author}, your char file!`, attachment)
  //   //   .then((m) => {
  //   //     m.delete(10000);
  //   //   });
  // }

  handle(msg) {
    if ((this.handleAttr(msg)
      || this.handleCombatSkills(msg)
      || this.handleSubcommands(msg)
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
      case 'save':
        this.handleSave(msg);
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

};
