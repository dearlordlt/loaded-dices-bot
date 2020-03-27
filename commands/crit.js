const crit = (arguments, command, sendMsg) => {
    const roll = r();
    const type = arguments[0]; //melee, ranged, spell
    const value = arguments[1]; //3, 4, 17, 18

    if (type != 'melee' && type != 'ranged' && type != 'spell') {
        sendMsg(msg, `unknown type: ${type}, must be melee, ranged or spell`, command, arguments);
    } else if (value != '3' && value != '4' && value != '17' && value != '18') {
        sendMsg(msg, `wrong value: ${value}, must be 3, 4, 17 or 18`, command, arguments);
    } else {
        let message = '';

        if (type === 'melee') {
            if (value == 17 || value == 18) message = Rules.getMeleeFortune(roll, value);
            if (value == 3 || value == 4) message = Rules.getMeleeMisfortune(roll, value);
        }

        if (type === 'ranged') {
            if (value == 17 || value == 18) message = Rules.getRangedFortune(roll, value);
            if (value == 3 || value == 4) message = Rules.getRangedMisfortune(roll, value);
        }

        if (type === 'spell') {
            if (value == 17 || value == 18) message = Rules.getMagicFortune(roll, value);
            if (value == 3 || value == 4) message = Rules.getMagicMisfortune(roll, value);
        }

        let line = `roll - ${roll}: ${message}`;
        sendMsg(msg, line, command, arguments);
    }
}

module.exports = {
    crit,
}