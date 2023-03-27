require('dotenv').config({ path: './config/.env' });
const colors = require("./colors.json");
const { Client, Intents, Collection } = require("discord.js");
var cron = require('node-cron');

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
    cron.schedule('0 13 * * *', async () => {
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
});

//Events manager
client.on("interactionCreate", async (interaction) => {
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
});


//Token
client.login(process.env.TOKEN)
