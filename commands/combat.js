const { r, decorateRoll } = require('../utils');
const { variables } = requre('./variables');
const combat={
    handle(msg, environment){
        let args = msg.content.match(/!c\s*(\d*)*\s*([a-z]*)*\s*([+-])*\s*(\d*)*/i);
        let dices = parseInt(args[1] || "3");
        const variable = args[2] || "<not exists>";
        let sign = (args[3] === "-") ? -1 : 1;
        let mod = parseInt(args[4] || "0");
        mod = sign * mod;
    
        if (dices > 0) {
            const bonus = variables.getVariable(msg.author.id, variable);
            if (bonus !== 0) {
                sendMsg(msg, `using ${variable}=${bonus}`);
                mod = mod + bonus;
            }
            let roll = [...Array(dices)].map(el => el = r());
            let initialRollSum = roll.reduce((a, b) => a + b, 0);
            let line = `roll: [${decorateRoll(roll, dices)}] = ${initialRollSum}`;
            if (initialRollSum > 16)
                line = `${line} **critical success !!!** `;
            if (initialRollSum < 5)
                line = `${line} **critical failure !!!** `;
    
            if (initialRollSum <= environment.autofail) {
                line = `${line} **autofail**`;
                sendMsg(msg, line);
                return;
            }
    
            if (mod != 0)
                line = `${line} ${(mod > 0) ? '+' + mod : mod}=${initialRollSum + mod}`;
    
            sendMsg(msg, line);
    
    
        } else {
            sendMsg(msg, 'how many?');
        }
    },
    help(){
        return `**COMBAT:**
        !c 3 + 10 //3d6 + 10
        !c + 10 //3d6 + 10
        !c //3d6`;
    }
}
module.exports = {
    combat,
}