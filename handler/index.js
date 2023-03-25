const { glob } = require("glob");
const { promisify } = require("util");
const { Client, Interaction, MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const axios = require('axios');

const colors = require("../colors.json");
var cron = require('node-cron');
const fetch = require("node-fetch");
const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    // Commands
    const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }
    });

    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));

    // Slash Commands
    const slashCommands = await globPromise(
        `${process.cwd()}/SlashCommands/*/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });
    client.on("ready", async () => {
        // Register for a single guild
        await client.guilds.cache
            .get("195553348835999745")
            .commands.set(arrayOfSlashCommands);
        // Register for all the guilds the bot is in
        // await client.application.commands.set(arrayOfSlashCommands);

        // Appel initial pour vérifier les lancements
        checkAndSendLaunches(client);

        // Vérifier les lancements toutes les heures
        setInterval(() => {
          checkAndSendLaunches(client);
        }, 1000 * 60 * 60);
    });


    //daily meme
    cron.schedule('0 13 * * *', async()  => {   
        const subReddits = ["meme", "memes"];
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];
        const reddit = await fetch(`https://www.reddit.com/r/${random}/top/.json?sort=top&t=day`).then(res => res.json())
        const img = reddit.data.children[Math.floor(Math.random() * reddit.data.children.length)].data.url;
        // const img = await random_search(random);
        const embed = new MessageEmbed()
            .setColor("00FF00")
            .setImage(img)
            .setTitle(`From reddit.com/r/${random}`)
            .setURL(`https://reddit.com/r/${random}`)
        if (img.endsWith("mp4") || img.endsWith("gif")) { client.channels.cache.get("195553348835999745").send(img); return }
        client.channels.cache.get("195553348835999745").send({embeds: [embed]})
    });

    //cron.schedule('*/1 * * *', async()  => {   
        
    //});
    
    //log
    client.on("voiceStateUpdate", (oldMember, newMember) => {
        let oldV = oldMember.channel;
        let newV = newMember.channel;
        const guild = client.guilds.fetch(newMember.guild.id);
        const log = guild.catch(channel => channel.name === "logs" && channel.type === "GUILD_TEXT");
        if (!log) {return}
        var embed = new Discord.MessageEmbed().setTitle("Connection Logs").setTimestamp()
        .setThumbnail(client.users.cache.get(newMember.id).avatarURL({ dynamic: true, format: 'png', size: 64 }))
    
        if (oldV != newV) {
            if (oldV == null) {
                embed.setColor(colors.green)
                .setDescription(`🔊${newMember.member} **joined\nchannel:** \`${newV.name}\``)
            } else if (newV == null) {
                embed.setColor(colors.red)
                .setDescription(`${newMember.member} **left\nchannel:** \`${oldV.name}\``)
            } else {
                embed.setColor(colors.yellow)
                .setDescription(`💨${newMember.member} **moved\nfrom:** \`${oldV.name}\` **\nto:** \`${newV.name}\``)
            }
            client.channels.cache.get("885840801769324554").send({embeds: [embed]});
        }
    });  
    // Fonction pour obtenir la date actuelle en format YYYY-MM-DD
};

//Send Launch activity 24h before

const channelId = '869668082694635531'; // Remplacez par l'ID du channel où vous souhaitez envoyer les notifications
const displayedLaunchIds = new Set();

async function getUpcomingLaunches(retryCount = 0) {
  const maxRetries = 5; // Maximum de tentatives de réessai
  const retryDelay = 1000; // Délai de base en millisecondes pour les réessais

  try {
    const currentDate = new Date().toISOString();
    const response = await axios.get(`https://ll.thespacedevs.com/2.0.0/launch/upcoming?limit=5&net__gte=${currentDate}`);
    return response.data.results;
  } catch (error) {
    if (error.response && error.response.status === 429 && retryCount < maxRetries) {
      // Attente exponentielle pour réessayer
      const delay = retryDelay * Math.pow(2, retryCount);
      console.warn(`Erreur 429 : Trop de requêtes. Réessai dans ${delay} ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Réessai après le délai
      return getUpcomingLaunches(retryCount + 1);
    } else {
      console.error(error);
    }
  }
}

function formatLaunchMessage(launch) {
  const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(launch.name)
    .setURL(launch.url)
    .addFields(
      { name: 'Date de lancement', value: launch.net },
      { name: 'Agence', value: launch.launch_service_provider.name },
    );

  return embed;
}

async function checkAndSendLaunches(client) {
  const launches = await getUpcomingLaunches();
  const channel = await client.channels.fetch(channelId);

  for (const launch of launches) {
    const now = new Date();
    const launchDate = new Date(launch.net);
    const diffHours = (launchDate - now) / (1000 * 60 * 60);

    if (diffHours <= 72 && diffHours > 0 && !displayedLaunchIds.has(launch.id)) {
      const message = formatLaunchMessage(launch);
      channel.send({ embeds: [message] });
      displayedLaunchIds.add(launch.id); // Ajouter l'ID du lancement au Set
    }
  }
}