const { Client, Collection } = require("discord.js");

const client = new Client({
    intents: 32767,
});
module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require("./prefix.json");

// Initializing the project
require("./handler")(client);

//Token
require('dotenv').config({ path: './config/.env' })
client.login(process.env.TOKEN);
