//http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=B16B00E3B8E631E9010F156AF6935FD1&steamid=76561198987712965&format=json

const axios = require("axios");
const Discord = require("discord.js");
const client = new Discord.Client();

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
        `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=B16B00E3B8E631E9010F156AF6935FD1&steamid=${steamID}&format=json`
      )
      .then(data => {
        const stats = data.data.playerstats.stats;
        const totalKills = stats[0].value;
        const totalDeaths = stats[1].value;
        const hsKills = stats[25].value;
        const totalMVP = stats[93].value;
        const KD = totalKills / totalDeaths;
        const HS = totalKills / hsKills;
        console.log(totalKills, totalDeaths, KD);
        const embedStats = new Discord.MessageEmbed()
          .setTitle("CSGO Stats")
          .setColor(0xff6600)
          .addField("Total Kills", totalKills)
          .addField("Total Deaths", totalDeaths)
          .addField("Total HeadShot Kills", hsKills)
          .addField('MVPS', totalMVP)
          .addField("KD", KD.toFixed(2))
          .addField("Headshot %", HS.toFixed(2) + "%")
          .setFooter("Developed By Tore.");
        msg.channel.send(embedStats);
      });
  }
});
client.login("ODAyNDgzMjM3Mzk3NTk0MTIy.YAv4wQ.ozQlTzizNNn3tzT4Tm6W2IwKrrE");