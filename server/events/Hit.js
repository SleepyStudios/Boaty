class HitEvent {
  constructor(game, socket) {
    socket.on('playerhit', data => {
      if(!this.getPlayer(game, data.victim)) return

      let player = this.getPlayer(game, data.victim).player
      let victimSocket = this.getPlayer(game, data.victim).socket

      if(!player) return
      
      player.health-=15
      if(player.health<0) player.health = 0

      game.io.sockets.emit('playerhit', { victim: data.victim, health: player.health})

      if(player.health===0) {
        let oldx = player.x
        let oldy = player.y
        let oldgold = player.gold

        player.x = game.rand(100, game.worldSize-300)
        player.y = game.rand(100, game.worldSize-300)
        player.gold = 0
        player.health = 100
        game.io.sockets.emit('death', player)

        game.addChest(oldx-50, oldy-50, false, Math.floor(oldgold*0.5))
      }
    })
  }

  getPlayer(game, id) {
    let temp = null

    Object.keys(game.io.sockets.connected).forEach(socketID => {
      let player = game.io.sockets.connected[socketID].player
      if(player && player.id===id) temp = {player, socket: game.io.sockets.connected[socketID]}
    })

    return temp
  }
}

export default HitEvent
