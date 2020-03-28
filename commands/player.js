const { sendMsg } = require('../utils');
class Player {
    constructor() {
        this.attr = {
            str:10,
            sta:10,
            dex:10,
            ref:10,
            per:10,
            will:10
        }
    }
    
    print (){
        return `${this.printAttr()}`;
    }
    printAttr(){
        return `**ATTRIBUTES**
            str:${this.attr.str}
            sta:${this.attr.sta}
            dex:${this.attr.dex}
            ref:${this.attr.ref}
            per:${this.attr.per}
            will:${this.attr.will}`;
    }
    setAttr(name,value){
        this.attr[name]=value;
    }
    handle(msg){
        let args = msg.content.match(/!player\s*(str|sta|dex|ref|per|will)*\s*(\d*)/i);
        if (args){
            this.handleAttr(msg,args);
            return;
        }
    }
    handleAttr(msg,args){
        if (args[2] && args[3]){
            this.setAttr(args[2],parseInt(args[3]));
            sendMsg(msg,`${args[2]}=${args[3]}`);
        } else{
            sendMsg(msg,this.printAttr());
        }

    }
}
module.exports = {
    Player,
}