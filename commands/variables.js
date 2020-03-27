const { sendMsg } = require('../utils');
class Variables {
    localVariablesMap = {};
    help(){
        return `**VAR:**
            !var bow 18 //sets bow to 18 for user
            !c bow //rolls 3d + bow
            !var list //list all variables for user
            !var clear //clear all variable for user
            !var bow //removes only bow variable`;
    };
    getVariable(author, varName) {
        if (author in this.localVariablesMap)
            if (varName in this.localVariablesMap[author])
                return this.localVariablesMap[author][varName];
        return 0;
    };
    handle(msg){
        const author = msg.author.id;

        if (!(author in this.localVariablesMap))
        this.localVariablesMap[author] = {};
        let args = msg.content.match(/!var\s*((list)*(clear)*)\s*/i);
        if (args) {
            if (args[1] === 'list') {
                let lines = '';
                const myVars = this.localVariablesMap[author];
                Object.keys(myVars).forEach(e => lines = `${lines}\n ${e}=${myVars[e]}`);
                msg.reply(`**Variables:**\n${lines}`);
                return;
            }
            else if (args[1] === 'clear') {
                delete this.localVariablesMap[author];
                sendMsg(msg, `all variables cleared`);
                return;
            }

        }
        args = msg.content.match(/!var\s*([a-z]+)\s*(\S*)/i);
        if (args) {
            if (args[2]) {
                this.localVariablesMap[author][args[1]] = parseInt(args[2]);
                sendMsg(msg, `added ${args[1]}=${args[2]}`);
            }
            else if (args[1] in this.localVariablesMap[author]) {
                delete this.localVariablesMap[author][args[1]];
                sendMsg(msg, `removed ${args[1]}`);
            }
            return;
        }
        //print help
        sendMsg(msg, this.help());
    }
}
const variables=new Variables();
module.exports = {
    variables,
}