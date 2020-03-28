const { Player } = require('./commands/player');
class PlayerManager{
    constructor(){
        this.localPlayers = {};
    }
    
    getPlayer(id,name){
        if (!(id in this.localPlayers))
            this.localPlayers[id] = new Player(name);

        return this.localPlayers[id];
    }
}

const playerManager = new PlayerManager();
module.exports = {
    playerManager,
}