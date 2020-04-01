class Rules {
  static locations = ['Head', 'Body', 'LArm', 'RArm', 'LLeg', 'RLeg'];

  static sublocations = {
    Head: {
      1: 'Scull: **+1T**',
      2: 'Scull: **+1T**',
      3: 'Face: **+1B**',
      4: 'Face: **+1B**',
      5: 'Neck: **+2B**',
      6: 'Eye: **+2C** and usually unarmored',
    },
    Body: {
      1: 'Flesh: **+1T**',
      2: 'Flesh: **+1T**',
      3: 'Flesh: **+1T**',
      4: 'Flesh: **+1T**',
      5: 'Vital organs: **+2C and**',
      6: 'Vital organs: **+2C and**',
    },
    LArm: {
      1: 'Flesh: **+1T**',
      2: 'Flesh: **+1T**',
      3: 'Flesh: **+1T**',
      4: 'Flesh: **+1T**',
      5: 'Flesh: **+1T**',
      6: 'Joint or Tendon: **+2T and 50% to drop weapon**',
    },
    RArm: {
      1: 'Flesh: **+1T**',
      2: 'Flesh: **+1T**',
      3: 'Flesh: **+1T**',
      4: 'Flesh: **+1T**',
      5: 'Flesh: **+1T**',
      6: 'Joint or Tendon: **+2T and 50% to drop weapon**',
    },
    LLeg: {
      1: 'Flesh: **+1T**',
      2: 'Flesh: **+1T**',
      3: 'Flesh: **+1T**',
      4: 'Flesh: **+1T**',
      5: 'Joint or Tendon: **+2T and 3-4 kneels or is off-balance, 5-6 falls down**',
      6: 'Joint or Tendon: **+2T and 3-4 kneels or is off-balance, 5-6 falls down**',
    },
    RLeg: {
      1: 'Flesh: **+1T**',
      2: 'Flesh: **+1T**',
      3: 'Flesh: **+1T**',
      4: 'Flesh: **+1T**',
      5: 'Joint or Tendon: **+2T and 3-4 kneels or is off-balance, 5-6 falls down**',
      6: 'Joint or Tendon: **+2T and 3-4 kneels or is off-balance, 5-6 falls down**',
    },
  }

  static meleeFortune17 = {
    1: 'Victim loses weapon',
    2: '+2 Luck',
    3: '+2 Dmg',
    4: 'Gain Extra attack for free and +1 Luck',
    5: 'Blow does Max Dmg Effects',
    6: 'Blow does Double Dmg Effects',
  }

  static meleeFortune18 = {
    1: 'Victim falls down',
    2: '+3 Luck',
    3: '+3 Dmg',
    4: 'Gain Extra attack for free and +3 Luck',
    5: 'Blow does Double Dmg Effects',
    6: 'Blow does Triple Dmg Effects',
  }

  static rangedFortune17 = {
    1: 'Bypass Armor',
    2: '+2 Luck',
    3: 'Restore 2d Vigor',
    4: 'Bypass Armor and +2 Dmg',
    5: 'Attack does Max Dmg Effects',
    6: 'Attack does Double Dmg Effects',
  }

  static rangedFortune18 = {
    1: 'Bypass Armor and +1 Dmg',
    2: '+3 Luck',
    3: 'Restore 3d Vigor',
    4: 'Bypass Armor and +3 Dmg',
    5: 'Attack does Double Dmg Effects',
    6: 'Attack does Triple dmg Effects',
  }

  static meleeMisfortune3 = {
    1: '2 Armor pieces breaks, -1 Armor until fixed, if you don’t have armor -2 to all actions for next Turn',
    2: 'Lose balance, can’t do any actions until next turn and -2 to all defences',
    3: 'Lose weapon, if weapon has wooden parts - it breaks',
    4: 'Fall down and lose weapon, if weapon has wooden parts - it breaks',
    5: 'You gain injury to your attack arm 2xTTTT',
    6: 'You gain injury to your attack arm 3xTTTT',
  }

  static meleeMisfortune4 = {
    1: 'Armor piece breaks, -1 Armor until fixed if you don’t have armor -1 to all actions for next Turn',
    2: 'Lose balance, can’t do any actions until next turn and -1 to all defences',
    3: 'Lose weapon',
    4: 'Fall down and lose weapon',
    5: 'You gain injury to your attack arm 1xTTTT',
    6: 'You gain injury to your attack arm 2xTTTT',
  }

  static rangedMisfortune3 = {
    1: 'The weapon is unusable until the end of combat. After that it needs some simple repairs',
    2: 'The weapon is unusable until the end of combat. After that it needs some complex repairs',
    3: 'If possible hit friendly target, if not - Lose weapon, weapon flies for 1d hexes to 1d direction (determined by hex side)',
    4: 'Lose balance, can’t do any actions until next turn and -2 to all defences',
    5: 'Get injury to Face: Bow/Crossbow - 2xTTTT, Firearms - 2xCCCC',
    6: 'Bow or Crossbow Breaks, Firearm explodes, also gain penalty from above^^ (Good quality weapons requires complex repairs instead)',
  }

  static rangedMisfortune4 = {
    1: 'The weapon is unusable until the end of combat.',
    2: 'The weapon is unusable until the end of combat. After that it needs some simple repairs',
    3: 'Lose weapon',
    4: 'Lose balance, can’t do any actions until next turn and -1 to all defences',
    5: 'Get injury to Face: Bow/Crossbow - 1xTTTT, Firearms - 1xCCCC',
    6: 'Bow or Crossbow Breaks, Firearm explodes, also gain penalty from above^^ (Good quality weapons requires complex repairs instead)',
  }

  static magicFortune17 = {
    1: 'Gain 2 Power',
    2: 'Gain 2 Power',
    3: 'Spell is Free',
    4: 'Spell is Free',
    5: 'Spell is Free and gain 2 Power',
    6: 'Spell is Free and gain 2 Power',
  }

  static magicFortune18 = {
    1: 'Spell is Free',
    2: 'Spell is Free',
    3: 'Spell is Free and gain 2 Power',
    4: 'Spell is Free and gain 2 Power',
    5: 'Spell is Free and gain 4 Power',
    6: 'Spell is Free and gain 4 Power',
  }

  static magicMisfortune3 = {
    1: 'Loose additional 3 Power',
    2: 'Loose additional 3 Power',
    3: 'Loose Double Power',
    4: 'Loose Double Power',
    5: 'Loose All Power',
    6: 'Loose All Power',
  }

  static magicMisfortune4 = {
    1: 'Loose additional 2 Power',
    2: 'Loose additional 2 Power',
    3: 'Loose additional 3 Power',
    4: 'Loose additional 3 Power',
    5: 'Lose Double Power',
    6: 'Lose Double Power',
  }

  static getMeleeFortune(roll, type) {
    return this[`meleeFortune${type}`][roll];
  }

  static getMeleeMisfortune(roll, type) {
    return this[`meleeMisfortune${type}`][roll];
  }

  static getRangedFortune(roll, type) {
    return this[`rangedFortune${type}`][roll];
  }

  static getRangedMisfortune(roll, type) {
    return this[`rangedMisfortune${type}`][roll];
  }

  static getMagicFortune(roll, type) {
    return this[`magicFortune${type}`][roll];
  }

  static getMagicMisfortune(roll, type) {
    return this[`magicMisfortune${type}`][roll];
  }

  static getLocation(roll) {
    return this.locations[roll - 1];
  }

  static getSubLocation(roll, location) {
    return this.sublocations[location][roll];
  }
}

module.exports = {
  Rules,
};
