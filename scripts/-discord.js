module.exports = (() => {
  const Discord = require("discord.js");
  let name = "Discord Gateway"
  let version = "1.0.0"

  function install() {
    let config = new server.ConfigManager(name, {
      guildId: "866716220035039313",
      channelId: {
        "903211440989671425": "main"
      },
      botToken: "",
      botControlRole: "Bot",
    }).config

    const bot = new Discord.Client({
      disableEveryone: true
    });
    server.bot = bot;
    
    console.log(bot);

    function getKeyByValue(object, value) {
      for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
          if (object[prop] === value)
            return prop;
        }
      }
      return false;
    }
    bot.on("message", async (message) => {
        if(message.channel.id == "903211440989671425"){
            if (message.author.bot) return;
            if (message.channel.type === "dm") return;

            server.players.sendToWorld("main", `[D] [${message.guild.name}] [${message.author.username}]: ${message.content}`);
        } else if(message.channel.id == "903211440989671425"){
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;
        server.players.sendToWorld("main", `[D] [${message.guild.name}] [${message.author.username}]: ${message.content}`);
    }
    });
    server.events.on("chat", function(client, msg) {
      var channelId = "903211440989671425";
      if (channelId == false) return;
      let before = client.before.replace(/<(?:alt=("|')(.+?)\1|.|\n)+>/gm, "$2");
      bot.guilds.cache.get("866716220035039313").channels.cache.get("903211440989671425").send(`${before}: ${msg}`)
    })
    bot.login(process.env.token);
  }
  return {
    install,
    name,
    version
  }
})()
