require('dotenv').config({ path: './config/.env' });
const colors = require("./colors.json");
const { Client, Intents, Collection, EmbedBuilder } = require("discord.js");
var cron = require('node-cron');
const axios = require('axios');
const fs = require("fs");
const path = require("path");

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { execute } = require('./SlashCommands/info/ping');
const client = new Client({ intents: 3276799 });
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);


client.commands = new Collection();
client.slashCommands = new Collection();

client.on("ready", async () => {

    // Load commands
    const loadCommands = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                loadCommands(filePath);
            } else if (file.endsWith(".js")) {
                const relativePath = path.relative(__dirname, filePath);
                const command = require(`./${relativePath}`);
                if (command.data && typeof command.execute === "function") {
                    client.commands.set(command.data.name, command);
                    console.log(`Commands Load : ✅ ${command.data.name}`);
                }
            }
        }
    };
    loadCommands("./SlashCommands");

    //daily meme
    cron.schedule('0 20 * * *', async () => {
        const options = '195553348835999745'
        client.commands.get('meme').execute({ client, options })
    });


    //Commands register
    const clientId = "768859055313387550";
    const guildId = "195553348835999745";

    await (async () => {
        try {
            const commandData = Array.from(client.commands.values()).map((command) => command.data.toJSON());
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandData });
            console.log("Succefully load commands !");
        } catch (error) {
            console.error("Error while load commands :", error);
        }
    })();
    console.log("NeptuneBot Ready !");

    // Appel initial pour vérifier les lancements
    checkAndSendLaunches(client);

    // Vérifier les lancements toutes les heures
    setInterval(() => {
      checkAndSendLaunches(client);
    }, 1000 * 60 * 60);
});

//-------------------------------------------------------------------------------------------------------------------------------------------//

//Events manager
client.on("interactionCreate", async (interaction) => {
    try {
        // Slash command management
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            const options = interaction.options._hoistedOptions;
            await command.execute({client, interaction, options});
        }
        // Selection menu management
        else if (interaction.isStringSelectMenu()) {
            await client.commands.get(interaction.message.interaction.commandName).execute({client, interaction})
        }
        // Button management
        else if (interaction.isButton()) {
            await client.commands.get(interaction.message.interaction.commandName).execute({client, interaction})
        }
    } catch (e) {console.error('Error in interactionCreate:', e)}
    /*
    //Slash commannds management
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    const options = interaction.options._hoistedOptions;

    if (!command) return;

    try {
        await command.execute({ client, interaction, options });
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "Une erreur s'est produite lors de l'exécution de cette commande.", ephemeral: true });
    }
    // Selection menu management
    if (interaction.isStringSelectMenu()) {
        await client.Commands.get(interaction.message.interaction.commandName).execute({client, interaction})
    }
    // Button management
    else if (interaction.isButton()) {
        await client.Commands.get(interaction.message.interaction.commandName).execute({client, interaction})
    }*/
});

//-------------------------------------------------------------------------------------------------------------------------------------------//

//Connection log
client.on("voiceStateUpdate", (oldMember, newMember) => {
    let oldV = oldMember.channel;
    let newV = newMember.channel;
    const guild = client.guilds.fetch(newMember.guild.id);
    const log = guild.catch(channel => channel.name === "logs" && channel.type === "GUILD_TEXT");
    if (!log) {return}
    var embed = new EmbedBuilder()
      .setTitle("Connection Logs")
      .setTimestamp()
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

//-------------------------------------------------------------------------------------------------------------------------------------------//

//Schedule launch 24h before
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
  const embed = new EmbedBuilder()
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

    if (diffHours <= 24 && diffHours > 0 && !displayedLaunchIds.has(launch.id)) {
      const message = formatLaunchMessage(launch);
      channel.send({ embeds: [message] });
      displayedLaunchIds.add(launch.id); // Ajouter l'ID du lancement au Set
    }
  }
}


//Token
client.login(process.env.TOKEN)
