doas() {
    let od = parseInt(this.args[0]);
    var mes = this.args;
    mes.shift();
    mes = mes.join(" ");
    let victim = this.world.clients.find(function(item) {
      return item.id == od
    }.bind(this))
    if (victim && mes) {
      if (mes.length <= 512 || victim.rank > permissions.user) {
          if (mes[0] == "/") {
            new Commands(mes, victim, victim.world)
          } else {
            if(victim.rank < permissions.mod) {
              var string=mes.split("\n").slice(0, 3).join("\n"); //weirdo way
              string+=mes.split("\n").slice(3).join("")
              mes = string;
            }
            var tmpIsStaff = victim.rank > permissions.user
            var tmpIsMod = victim.rank == permissions.mod
            var tmpIsAdmin = victim.rank == permissions.admin
            var tmpIsOwner = victim.rank == permissions.owner
            var before = "";
            if (victim.stealth) {
              tmpIsAdmin = false;
              tmpIsMod = false;
              tmpIsStaff = false;
              tmpIsOwner = false;
            }
            if (tmpIsOwner) before += "[OWNER] ";
            if (tmpIsAdmin) before += "(True Administrator) ";
            if (tmpIsMod) before += "(Moderator) ";
            if (victim.nick && !tmpIsStaff) {
              before += `[${victim.id}] ${victim.nick}`;
            } else if (victim.nick && tmpIsStaff) {
              before += victim.nick;
            }
            if (!victim.nick) {
              before += victim.id;
            }
            victim.before = before
            
            server.players.sendToWorld(victim.world, before + ": " + mes);
						server.events.emit("chat", victim, mes)
          }
        }
    } else {
      this.client.send("Usage:\n /doas [id] [message]");
    }
  }