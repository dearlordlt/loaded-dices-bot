const { Player } = require('./commands/player');
class PlayerManager{
    constructor(){
        this.localPlayers = {};
    }
    
    getPlayer(id){
        if (!(id in this.localPlayers))
            this.localPlayers[id] = new Player();

        return this.localPlayers[id];
    }
}

const playerManager = new PlayerManager();
module.exports = {
    playerManager,
}