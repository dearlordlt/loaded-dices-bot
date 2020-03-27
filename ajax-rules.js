class Rules {

    static locations = ['Head', 'Body', 'LArm', 'RArm', 'LLeg', 'RLeg'];

    static sublocations = {
        Head: {
            1: 'Scull: **+2T** but **+1Armor**',
            2: 'Scull: **+2T** but **+1Armor**',
            3: 'Scull: **+2T** but **+1Armor**',
            4: 'Face: **+2B**',
            5: 'Face: **+2B**',
            6: 'Eye: **+2C** and usually unarmored',
        },
        Body: {
            1: 'Flesh: **+2Dmg**',
            2: 'Flesh: **+2Dmg**',
            3: 'Flesh: **+2Dmg**',
            4: 'Flesh: **+2Dmg**',
            5: 'Vital organs: **+1C and +1Dmg**',
            6: 'Vital organs: **+1C and +1Dmg**',
        },
        LArm: {
            1: 'Flesh: **+1Dmg**',
            2: 'Flesh: **+1Dmg**',
            3: 'Flesh: **+1Dmg**',
            4: 'Flesh: **+1Dmg**',
            5: 'Joint or Tendon: **+1T and 50% to drop weapon**',
            6: 'Joint or Tendon: **+1T and 50% to drop weapon**',
        },
        RArm: {
            1: 'Flesh: **+1Dmg**',
            2: 'Flesh: **+1Dmg**',
            3: 'Flesh: **+1Dmg**',
            4: 'Flesh: **+1Dmg**',
            5: 'Joint or Tendon: **+1T and 50% to drop weapon**',
            6: 'Joint or Tendon: **+1T and 50% to drop weapon**',
        },
        LLeg: {
            1: 'Flesh: **+1Dmg**',
            2: 'Flesh: **+1Dmg**',
            3: 'Flesh: **+1Dmg**',
            4: 'Flesh: **+1Dmg**',
            5: 'Joint or Tendon: **+1T and 3-4 kneels or is off-balance, 5-6 falls down**',
            6: 'Joint or Tendon: **+1T and 3-4 kneels or is off-balance, 5-6 falls down**',
        },
        RLeg: {
            1: 'Flesh: **+1Dmg**',
            2: 'Flesh: **+1Dmg**',
            3: 'Flesh: **+1Dmg**',
            4: 'Flesh: **+1Dmg**',
            5: 'Joint or Tendon: **+1T and 3-4 kneels or is off-balance, 5-6 falls down**',
            6: 'Joint or Tendon: **+1T and 3-4 kneels or is off-balance, 5-6 falls down**',
        }
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
}