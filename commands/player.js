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
        };
        this.combatSkills={
            
        };
    }
    
    print (){
        return `${this.printAttr()}
                ${this.printCombatSkills()}`;
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
    printCombatSkills(){
        let lines = '**COMBAT SKILLS**\n';
        Object.keys(this.combatSkills).forEach(e => lines = `${lines}\n ${e}=${this.combatSkills[e]}`);
        return lines;
    }
    setAttr(name,value){
        this.attr[name]=value;
    }
    handle(msg){
        let args = msg.content.match(/!player\s*(str|sta|dex|ref|per|will)\s*(\d*)/i);
        if (args){
            this.handleAttr(msg,args);
            return;
        }
        args= msg.content.match(/!player\s+(combat)(\s+(\S+)\s*((\d+)\s*(a=(\S+))*\s*(d=(\S+))*)*)*/i);
        if (args){
            this.handleCombatSkills(msg,args);
            return;
        }

    }
    handleAttr(msg,args){
        if (args[1] && args[2]){
            this.setAttr(args[1],parseInt(args[2]));
            sendMsg(msg,`${args[1]}=${args[2]}`);
        } else{
            sendMsg(msg,this.printAttr());
        }

    }
    getCombatSkill(name){
        if(! (name in this.combatSkills)){
            this.combatSkills[name]={
                lvl:0,
                attack:"ref",
                defense:"dex"
            }
        }
        return this.combatSkills[name];
    }
    handleCombatSkills(msg,args){
        const name=args[3];
        const lvl=args[5];
        const a=args[7];
        const d=args[9];

        if (name && lvl){
             //nurodytas skill name ir lvl
            const skill=this.getCombatSkill(name);
            skill.lvl=parseInt(lvl);
            if(a) skill.attack=a;
            if(d) skill.defense=d;

            sendMsg(msg,`combat skill ${name}=${skill.lvl} attack=${skill.attack} defense=${skill.defense}`);
        }
        else if(name){
            const skill=this.getCombatSkill(name);
            sendMsg(msg,`combat skill ${name}=${skill.lvl} attack=${skill.attack} defense=${skill.defense}`);
        }
        else{
            sendMsg(msg,this.printCombatSkills())
        }
        
    } 
}
module.exports = {
    Player,
}