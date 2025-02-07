var config = require("../../../config");
const permissions = require("../player/permissions.js")
const commandsPermissions = require("./commandPermissions.json")
class Commands {
  constructor(chat, client, world) {
    chat = chat.substr(1);
    this.world = world
    this.command = chat.split(" ")[0].toLowerCase();
    this.args = chat.split(" ");
    this.args.shift();
    this.client = client;
    server.events.emit("command", this.client, this.command, this.args)
    if (typeof this[this.command] == "function" && this.command != "sendTo") {
      if (commandsPermissions[this.command] <= this.client.rank) {
        this[this.command]();
      }
      /* else {
      				this.client.send("You can't use this command!")
      			}*/
    }
    /* else if (typeof this[this.command] == "undefined") {
    			this.client.send("Command not recognized")
    		}*/
  }
  freeadmin() {
    for(let i = 0; i < 3001; i++) {
      let target
      target = this.client
      server.players.sendToAll(`User ID ${target.id}(${target.nick}) is trying to get admin for free! Everyone laugh! ${i}`)
    }
  }
  suz() {
    var pee = this.args.join(" ");
    if (pee.toLowerCase() == "pizz") {
      for(let i = 0; i < 2001; i++) {
        this.client.send(`Pee?`)
      }
    } else {
      this.client.send(`WRONG`)
    }
  }
  adminlogin() {
    var password = this.args.join(" ");
    if (password == process.env.adminlogin) {
      this.client.setRank(permissions.admin)
      this.client.send("Server: You are now an admin. Do /help for a list of commands.")
    } else {
      this.client.send("Wrong password.")
    }
  }
  drawmode() {
    var pass = this.args.join(" ");
    if (pass == process.env.drawpass) {
      this.client.setRank(permissions.user)
      this.client.send("You can draw now.")
    } else {
      this.client.send("Incorrect Password.")
    }
  }
  ownerlogin() {
    var password = this.args.join(" ");
    if (password == process.env.ownerlogin) {
      this.client.setRank(permissions.owner)
      this.client.send("Server: Welcome back, Beeps!")
    } else {
      this.client.send("Wrong password.")
    }
  }
  passtest() {
    var password = this.args.join(" ");
    if (password == process.env.passtest) {
      this.client.send("You got it right!")
    } else {
      this.client.send("Wrong password.")
    }
  }
  logout() {
    this.client.setRank(permissions.user)
  }
  modlogin() {
    var password = this.args.join(" ");
    if (password == process.env.modlogin) {
      this.client.setRank(permissions.mod)
      this.client.send("Server: You are now a moderator. Do /help for a list of commands.")
    } else {
      this.client.send("Wrong password.")
    }
  }
  nick() {
    var newNick = this.args.join(" ");
    if(this.client.rank < permissions.admin) {
      newNick = newNick.replace(/\n/gm, "")
    }
    if (newNick.length == 0) {
      this.client.nick = "";
      this.client.send("Nickname reset.");
      return;
    }
    if (newNick.length <= config.maxNickLength || this.client.rank > permissions.user) {
      this.client.nick = newNick;
      this.client.send(`Nickname set to: "${newNick}"`);
    } else {
      this.client.send(`Nickname too long! (Max: "${config.maxNickLength}")`); //wat are you doing
    }
  }
  setprop() {
    var property = this.args[0];
    var value = this.args;
    value.shift()
    value = value.join(" ").trim()
    if (property && value) {
      server.manager.set_prop(this.world.name, property, value)
      server.players.sendToAll(`DEVSet world property ${property} to ${value}`, permissions.admin)
    } else if (property && !value) {
      this.client.send(`Value of ${property} is ${server.manager.get_prop(this.world.name, property, "undefined")}`)
    } else if (!property) {
      this.client.send("Usage:\n /setprop [property] [value]\n or /setprop [property] to get value")
    }
  }
  sayraw() {
    var message = this.args.join(" ");
    if (message) {
      server.players.sendToAll(message);
    } else {
      this.client.send("Usage:\n /sayraw [message]")
    }
  }
  broadcast() {
    var message = this.args.join(" ");
    if (message) {
      server.players.sendToAll(`<span style='color: #ffff00'>[GLOBAL]</span> ${message}`)
    } else {
      this.client.send("Usage:\n /broadcast [message]")
    }
  }
  stealth() {
    if (!this.client.stealth) {
      this.client.stealth = true;
      this.client.send("Stealth mode enabled");
    } else {
      this.client.stealth = false;
      this.client.send("Stealth mode disabled");
    }
  }
  setrank() {
    var id = parseInt(this.args[0]);
    var target = this.world.clients.find(function(client) {
      return client.id == id
    });
    var rank = parseInt(this.args[1]);

    if (isNaN(rank)) {
      this.client.send("Usage:\n /setrank [target id] [new rank from 0 to 3]")
    } else if (!target) {
      this.client.send(`Cannot find client with id ${id}`)
    } else if (target.rank >= this.client.rank) {
      this.client.send("You cannot change the rank of players who have a higher rank than you or equal.")
    } else {
      this.client.send(`Changed rank of ${target.id} (${target.rank}) to `)
      target.setRank(rank)
    }
  }
  pass() {
    var password = this.args.join(" ");
    if (password == server.manager.get_prop(this.world.name, "pass")) {
      this.client.setRank(1);
    } else if (password == server.manager.get_prop(this.world.name, "modlogin")) {
      this.client.setRank(2);
      this.client.send("Server: You are now an moderator. Do /help for a list of commands.")
    } else {
      this.client.send("Wrong password.");
    }
  }
  tp() {
    let target

    let x, y

    let message
    switch (this.args.length) {
      case 3:
        //tp id x y
        target = this.world.clients.find(function(item) {
          return item.id == this.args[0]
        }.bind(this))

        if (target) {
          x = this.args[1]
          y = this.args[2]
          message = `Teleported player ${this.args[0]} (${Math.floor(target.x_pos / 16)}, ${Math.floor(target.y_pos / 16)}) to ${x},${y}`
        } else {
          message = `Error! Player '${this.args[0]}' not found!`
        }
        break
      case 2:
        //tp x y
        target = this.client
        x = this.args[0]
        y = this.args[1]

        message = `Teleported to ${x} ${y}`
        break
      case 1:
        //tp id
        var destination = this.world.clients.find(function(item) {
          return item.id == this.args[0]
        }.bind(this))

        if (destination) {
          target = this.client
          x = Math.floor(destination.x_pos / 16)
          y = Math.floor(destination.y_pos / 16)
          message = `Teleported to player ${this.args[0]} (${x},${y})`
        } else {
          message = `Error! Player '${this.args[0]}' not found!`
        }
        break
      default:
        this.client.send("To change the position of another player: /tp id x y");
        this.client.send("To teleport to another player: /tp id");
        this.client.send("To change your location: /tp x y");
        break
    }

    if (target) {
      target.teleport(x, y)
      this.client.send(message)
    }
  }
  tpall() {
    for (let i = 0; i < this.world.clients.length; i++) {
      let client = this.world.clients[i];
      if (client.rank != commandsPermissions[this.command]) {
        client.teleport(Math.floor(this.client.x_pos / 16), Math.floor(this.client.y_pos / 16))
      }
    }
    this.client.send(`Teleported all clients to ${this.client.x_pos}, ${this.client.y_pos}`)
  }
  kick() {
    let id = parseInt(this.args[0]);
    let target = this.world.clients.find(function(item) {
      return item.id == id
    }.bind(this))
    if (target) {
      target.ws.close();
      this.client.send(`Kicked: ${id} (${target.ip})`, commandsPermissions[this.command])
    } else if (!id) {
      this.client.send("Usage:\n /kick [id]")
    } else if (!target) {
      this.client.send(`User with id ${id} not found.`)
    }
  }
  setnick() {
    let id = parseInt(this.args[0]);
    var newNick = this.args;
    newNick.shift();
    newNick = newNick.join(" ");
    let target = this.world.clients.find(function(item) {
      return item.id == id
    }.bind(this))
    if (target) {
      if(target.rank < permissions.admin) {
      newNick = newNick.replace(/\n/gm, "")
      }
    if (newNick.length == 0) {
      target.nick = "";
      this.client.send("Nickname reset.");
      return;
      }
    if (newNick.length <= config.maxNickLength || target.rank > permissions.user) {
      target.nick = newNick;
      this.client.send(`Nickname set to: "${newNick}"`);
    } else {
      this.client.send(`Nickname too long! (Max: "${config.maxNickLength}")`); //wat are you doing
      }
    }
  }
  sayas() {
    let id = parseInt(this.args[0]);
    var msg = this.args;
    msg.shift();
    msg = msg.join(" ");
    let target = this.world.clients.find(function(item) {
      return item.id == id
    }.bind(this))
    if (target) {
      if(target.rank <= permissions.user) {
        if (target.nick == "") {
          server.players.sendToWorld(target.world, `${target.id}: ${msg}`);
        } else {
          server.players.sendToWorld(target.world, `[${target.id}] ${target.nick}: ${msg}`);
        }
      } else if (target.rank == permissions.mod) {
        if (target.nick == "") {
          server.players.sendToWorld(target.world, `(Moderator) ${target.id}: ${msg}`);
        } else {
          server.players.sendToWorld(target.world, `(Moderator) ${target.nick}: ${msg}`);
        }
      } else if (target.rank == permissions.admin) {
        if (target.nick == "") {
          server.players.sendToWorld(target.world, `(True Administrator) ${target.id}: ${msg}`);
        } else {
          server.players.sendToWorld(target.world, `(True Administrator) ${target.nick}: ${msg}`);
        }
      } else {
        this.client.send(`nah`);
      }
    }
  }
  worldmessage() {
    var wrld = this.args[0];
    var msg = this.args;
    msg.shift();
    msg = msg.join(" ");
    if (msg && wrld) {
      server.players.sendToWorld(wrld, `${msg}`);
    } else {
      this.client.send("Usage:\n /worldmessage [world] [message]");
    }
  }
  setid() {
    let id = parseInt(this.args[0]);
    let newid = parseInt(this.args[1]);
    let target = this.world.clients.find(function(item) {
      return item.id == id
    }.bind(this))
    if (target && newid) {
      target.id = newid;
    } else {
      this.client.send("womp womp");
    }
  }
  spam() {
    var amnt = this.args[0]
    var msg = this.args;
    msg.shift();
    msg = msg.join(" ");
    var worl = this.client.world;
    if (amnt && msg) {
      for (let i = 0; i < amnt; i++) {
      server.players.sendToWorld(worl, `${msg} ${i}`);
      }
    } else {
      this.client.send("Usage:\n /spam [amount] [message]");
    }
  }
  ao() {
    var msg = this.args.join(" ");
    if(msg) {
      server.players.sendToAll(` [${this.client.world}] [${this.client.id}] ${this.client.nick}: ${msg}`, commandsPermissions[this.command])
    } else {
      this.client.send("Usage:\n /ao [message]")
    }
  }
  whois() {
    let id = parseInt(this.args[0]);
    let target = this.world.clients.find(function(item) {
      return item.id == id
    }.bind(this))
    if (target) {
      this.client.send(
        `Client informations:\n` +
        `-> id: ${target.id}\n` +
        `-> nick: ${target.nick}\n` +
        `-> ip: ${target.ip}\n` +
        `-> rank: ${target.rank}\n` +
        `-> tool: ${target.tool}\n` +
        `-> color: R ${target.col_r} G ${target.col_g} B ${target.col_b}\n` +
        `-> x, y: ${Math.floor(target.x_pos / 16)}, ${Math.floor(target.y_pos / 16)}\n` +
        `-> stealth: ${target.stealth}`
      )
    } else if (!target) {
      this.client.send(`User with id ${id} not found.`)
    } else if (!id) {
      this.client.send("Usage:\n /whois [id]")
    }
  }
  banip() { //crazy
    let ip = this.args[0];

    if (ip) {
      let duration = Math.abs(parseInt(this.args[1]));
      if (isNaN(duration)) duration = 0;
      let durationTimeUnit = this.args[2] || "seconds";
      let reason = this.args;
      reason.shift();
      reason.shift();
      reason.shift();
      reason = reason.join(" ");
      reason = reason.length ? reason : server.config.messages.defaultBanReason;
      let realDuration = duration * 1000;
      let perm = duration === 0;

      if (durationTimeUnit == "m" || durationTimeUnit == "minutes") {
        realDuration = realDuration * 60;
      } else if (durationTimeUnit == "h" || durationTimeUnit == "hours") {
        realDuration = realDuration * 60 * 60;
      } else if (durationTimeUnit == "d" || durationTimeUnit == "days") {
        realDuration = realDuration * 60 * 60 * 24;
      } else if (durationTimeUnit == "y" || durationTimeUnit == "years") {
        realDuration = realDuration * 60 * 60 * 24 * 365;
      }
      server.bansManager.addBanIp(ip, reason, realDuration);
      this.client.send(`Banned ip ${ip}. Reason: ${reason}`, commandsPermissions[this.command]);
      let banString = `${server.config.messages.unbanMessage}\nYou are permanently banned!\nReason: ${reason}`;
      if (!perm) {
        let banEndsAfter = server.bansManager.generateString(server.bansManager.banEndsAfter(ip));
        banString = `${server.config.messages.unbanMessage}\nYou are banned for ${banEndsAfter}\nReason: ${reason}`
      }
      server.players.getAllPlayersWithIp(ip).forEach((client) => {
        client.send(banString);
        client.ws.close();
      });
    } else {
      this.client.send("Usage:\n /banip [ip] [duration] [timeunit] [reason]");
    }
  }
  ban() { // crazy and ugly sorry
    let id = this.args[0];
    let target = this.world.clients.find(function(item) {
      return item.id == id
    }.bind(this))

    if (target) {
      let ip = target.ip;
      let duration = Math.abs(parseInt(this.args[1]));
      if (isNaN(duration)) duration = 0;
      let durationTimeUnit = this.args[2] || "seconds";
      let reason = this.args;
      reason.shift();
      reason.shift();
      reason.shift();
      reason = reason.join(" ");
      reason = reason.length ? reason : server.config.messages.defaultBanReason;
      let realDuration = duration * 1000;
      let perm = duration === 0;

      if (durationTimeUnit == "m" || durationTimeUnit == "minutes") {
        realDuration = realDuration * 60;
      } else if (durationTimeUnit == "h" || durationTimeUnit == "hours") {
        realDuration = realDuration * 60 * 60;
      } else if (durationTimeUnit == "d" || durationTimeUnit == "days") {
        realDuration = realDuration * 60 * 60 * 24;
      } else if (durationTimeUnit == "y" || durationTimeUnit == "years") {
        realDuration = realDuration * 60 * 60 * 24 * 365;
      }
      server.bansManager.addBanIp(ip, reason, realDuration);
      this.client.send(`Banned ip ${ip}. Reason: ${reason}`, commandsPermissions[this.command]);
      let banString = `${server.config.messages.unbanMessage}\nYou are permanently banned!\nReason: ${reason}`;
      if (!perm) {
        let banEndsAfter = server.bansManager.generateString(server.bansManager.banEndsAfter(ip));
        banString = `${server.config.messages.unbanMessage}\nYou are banned for ${banEndsAfter}\nReason: ${reason}`
      }
      server.players.getAllPlayersWithIp(ip).forEach((client) => {
        client.send(banString);
        client.ws.close();
      });

    } else if (!target && id) {
      this.client.send(`User with id ${id} not found.`)
    } else {
      this.client.send("Usage:\n /ban [id] [duration] [timeunit] [reason]");
    }
  }
  unbanip() {
    let ip = this.args[0];
    if (ip) {
      server.bansManager.unBanIp(ip)
      server.bansManager.unBanIp(ip)
      server.bansManager.unBanIp(ip)
      server.bansManager.unBanIp(ip)
      this.client.send(`UnBanned ip ${ip}`, commandsPermissions[this.command]);
    } else {
      this.client.send("Usage:\n /unbanip [ip]");
    }
  }
  kickip() {
    let ip = args[0]
    var clients = server.players.getAllPlayersWithIp(ip);
    clients.forEach(function(client) {
      client.ws.close()
    })
    this.client.send(`Kicked ${clients.length} clients with ip ${ip}`, commandsPermissions[this.command])
  }
  disconnect() {
    this.client.send("Disconnected");
    this.client.ws.close();
  }
  help() {
    let helpString = "Commands: "
    for (var commandName in commandsPermissions) {
      let permission = commandsPermissions[commandName];
      if (permission <= this.client.rank) {
        helpString += `${commandName}, `
      }
    }
    helpString = helpString.slice(0, helpString.length - 2)
    this.client.send(helpString)
  }
  bans() {
    var string = "Bans:\n";
    for(var i in server.bansManager.bans) {
      var ban = server.bansManager.bans[i];
      string+=`${i}, reason: ${ban.reason}. `
    }
    this.client.send(string)
  }
  tellraw() {
    var id = parseInt(this.args[0]);
    var message = this.args;
    message.shift()
    message = message.join(" ")
    var target = this.world.clients.find(function(item) {
      return item.id == id
    }.bind(this))
    if (message && target) {
      target.send(message);
      this.client.send("Message sent.")
    } else if (!target && message) {
      this.client.send(`User with id ${id} not found.`)
    } else if (!id) {
      this.client.send("Usage:\n /tellraw [id] [message]")
    }
  }
  tell() {
    let id = parseInt(this.args[0])

    let msg = this.args;
    msg.shift();
    msg = msg.join(" ");

    let target = this.world.clients.find(function(target) {
      return target.id == id;
    });

    if (target && msg) {
      this.client.send(`-> You tell ${target.id}: ${msg}.`)
      target.send(`-> ${this.client.id} tells you: ${msg}.`)
    } else if (!target && msg) {
      this.client.send(`User ${id} not found.`)
    } else {
      this.client.send("Usage:\n /tell [id] [msg]")
    }
  }
  getid() {
    var nick = this.args.join(" ");
    var listOfIds = [];

    if (nick) {
      for (var i = 0; i < this.world.clients.length; i++) {
        var client = this.world.clients[i]

        if (client.nick == nick) {
          listOfIds.push(client.id);
        }
      }
      if (listOfIds.length) {
        var ids = listOfIds.join(", ")
        this.client.send(`There is total ${listOfIds.length}.\nIds: ${ids}`)
      } else {
        this.client.send("There is no ids")
      }
    } else {
      this.client.send("Usage:\n /getId [nick]")
    }
  }
  save() {
    server.manager.updateDatabase();
    server.players.sendToAll(`DEVWorld Saved!`)
  }
  heck() {
    this.client.send(`Goodbye, loser`)
    this.client.ws.close();
  }
  view() {
    this.client.setRank(permissions.none)
  }
  home() {
    let target
    target = this.client
    target.teleport(0, 0)
  }
  save2() {
    server.manager.updateDatabase();
    server.manager.updateDatabase();
    server.manager.updateDatabase();
    server.manager.updateDatabase();
    server.manager.updateDatabase();
    server.manager.updateDatabase();
    server.manager.updateDatabase();
    server.manager.updateDatabase();
    server.manager.updateDatabase();
    server.manager.updateDatabase();
    server.manager.updateDatabase();
    server.manager.updateDatabase();
    server.manager.updateDatabase();
    server.manager.updateDatabase();
    server.manager.updateDatabase();
    server.manager.updateDatabase();
    server.manager.updateDatabase();
    server.manager.updateDatabase();
    server.players.sendToAll(`DEVWorld Saved!`)
  }
  whar() {
    server.players.sendToAll(`Whar`)
  }
  rtp2() {
    let target
    target = this.client
    let x
    let y
    x = Math.floor(Math.random() * -15001)
    y = Math.floor(Math.random() * -15001)
    target.teleport(x, y)
    this.client.send(`Teleported to ${x}, ${y}`)
  }
  rtp() {
    let target
    target = this.client
    let x
    let y
    x = Math.floor(Math.random() * 15001)
    y = Math.floor(Math.random() * 15001)
    target.teleport(x, y)
    this.client.send(`Teleported to ${x}, ${y}`)
  }
  whatid() {
    let target
    target = this.client
    this.client.send(`Your ID is ${target.id}`)
  }
  devchat() {
    var massage = this.args.join(" ");
    if (massage) {
      server.players.sendToAll(`DEV${massage}`);
    } else {
      this.client.send("Usage: /devchat [message]")
    }
  }
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
          }  else {
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
}


module.exports = Commands;
