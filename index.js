//http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=B16B00E3B8E631E9010F156AF6935FD1&steamid=76561198987712965&format=json

const axios = require("axios");
const Discord = require("discord.js");
const client = new Discord.Client();
const steamWebApiKey = "";
const tokenBot = "";
const embedStats = new Discord.MessageEmbed();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
  const prefix = ".";
  if (msg.author.bot) return;
  if (msg.content.indexOf(prefix) !== 0) return;
  const args = msg.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "stats") {
    const steamID = args[0];
    if (!steamID) return msg.channel.send("You haven't added your STEAMID");
    axios
      .get(
        `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${steamWebApiKey}&steamid=${steamID}&format=json`
      )
      .then(data => {
        const stats = data.data.playerstats.stats;
        const totalKills = stats[0].value;
        const totalDeaths = stats[1].value;
        const hsKills = stats[25].value;
        const totalMVP = stats[93].value;
        const KD = totalKills / totalDeaths;
        const HS = totalKills / hsKills * 100;
        embedStats
          .setTitle("CSGO Stats")
          .setColor(0xff6600)
          .addField("Total Kills", totalKills, true)
          .addField("Total Deaths", totalDeaths, true)
          .addField("Total HeadShot Kills", hsKills, true)
          .addField("MVPS", totalMVP, true)
          .addField("KD", KD.toFixed(2), true)
          //Maintance: .addField("Headshot %", HS.toFixed(2) + "%", true);
      })
      .catch(e => {
        if (e.response.status == "500") {
          msg.channel.send("ERROR: ", `${e.response.status} - SOL: Poner publicos los detalles de juegos.`);
        }
      });
    axios
      .get(
        `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamWebApiKey}&steamids=${steamID}&format=json`
      )
      .then(data => {
        const user = data.data.response.players;
        embedStats
          .setThumbnail(user[0].avatarmedium)
          .setDescription(`[User Profile](${user[0].profileurl})`)
          .setFooter("Developed By Tore.");
        msg.channel.send(embedStats);
      })
  }
});
client.login(tokenBot);
