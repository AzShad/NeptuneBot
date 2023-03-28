const { Client, CommandInteraction } = require("discord.js");
const DiscordJS = require('discord.js');

module.exports = {
    test: true,
    data: new DiscordJS.SlashCommandBuilder()
      .setName('ping')
      .setDescription('returns websocket ping'),
      
    async execute({client, interaction}){
      await interaction.deferReply();
      await interaction.editReply({ content: `${client.ws.ping}ms!` });
    },
};
