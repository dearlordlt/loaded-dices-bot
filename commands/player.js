const { MessageAttachment } = require('discord.js');
const fs = require('fs');
const { sendMsg } = require('../utils');

class Player {
  constructor(name) {
    this.name = name;
    this.fileName = `./localDb/chars/${this.name}.json`;

    this.attr = {
      str: 10,
      sta: 10,
      dex: 10,
      ref: 10,
      per: 10,
      will: 10,
    };
    this.combatSkills = {

    };

    if (fs.existsSync(this.fileName)) {
      const info = JSON.parse(fs.readFileSync(this.fileName));
      this.attr = info.attr;
      this.combatSkills = info.combatSkills;
    }
  }

  print() {
    return `
      ${this.printAttr().trim()}
      ${this.printCombatSkills().trim()}`;
  }

  printAttr() {
    return `
        **ATTRIBUTES**
            str:${this.attr.str}
            sta:${this.attr.sta}
            dex:${this.attr.dex}
            ref:${this.attr.ref}
            per:${this.attr.per}
            will:${this.attr.will}`;
  }

  printCombatSkills() {
    let lines = '**COMBAT SKILLS**\n';
    Object.keys(this.combatSkills).forEach((skill) => lines = `${lines}\n ${skill}=${this.combatSkills[skill].lvl} attack=${this.combatSkills[skill].attack} defense=${this.combatSkills[skill].defense}`);
    return lines;
  }

  setAttr(name, value) {
    this.attr[name] = value;
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
    fs.writeFileSync(this.fileName, JSON.stringify({
      attr: this.attr,
      combatSkills: this.combatSkills,
    }));
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
    let args = msg.content.match(/!p\s*(str|sta|dex|ref|per|will)\s*(\d*)/i);
    if (args) {
      this.handleAttr(msg, args);
      return;
    }
    args = msg.content.match(/!p\s+(combat|c)(\s+(add|remove)*\s*(\S+)\s*((\d+)\s*(a=(\S+))*\s*(d=(\S+))*)*)*/i);
    if (args) {
      this.handleCombatSkills(msg, args);
      return;
    }
    args = msg.content.match(/!p\s+(print|save)\s*/i);
    if (args && args[1]) {
      if (args[1] === 'print') sendMsg(msg, this.print());
      else if (args[1] === 'save') this.handleSave(msg);
      else sendMsg(msg, this.help());
    }
  }

  handleAttr(msg, args) {
    if (args[1] && args[2]) {
      this.setAttr(args[1], parseInt(args[2], 10));
      this.save();
      sendMsg(msg, `${args[1]}=${args[2]}`);
    } else {
      sendMsg(msg, this.printAttr());
    }
  }

  getCombatSkillValue(name, actionType) {
    const skill = this.getCombatSkill(name);
    if (skill.lvl > 0) {
      if (actionType in skill) return this.attr[skill[actionType]] + skill.lvl;
    }
    return 0;
  }

  getCombatSkillDescription(name, actionType) {
    const skill = this.getCombatSkill(name);
    if (skill.lvl > 0) {
      if (actionType in skill) return `${skill[actionType]}:${this.attr[skill[actionType]]} + ${skill.lvl}=${this.attr[skill[actionType]] + skill.lvl}`;
    }
    return '';
  }

  getOrCreateCombatSkill(name) {
    if (!(name in this.combatSkills)) {
      this.combatSkills[name] = {
        lvl: 0,
        attack: 'ref',
        defense: 'dex',
      };
    }
    return this.combatSkills[name];
  }

  getCombatSkill(name) {
    if ((name in this.combatSkills)) {
      return this.combatSkills[name];
    }
    return {
      lvl: 0,
      attack: 'ref',
      defense: 'dex',
    };
  }

  removeCombatSkill(name) {
    if (name in this.combatSkills) {
      delete this.combatSkills[name];
    }
  }

  handleCombatSkills(msg, args) {
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
  }
}
module.exports = {
  Player,
};
