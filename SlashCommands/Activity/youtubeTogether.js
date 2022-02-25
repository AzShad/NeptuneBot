const { CommandInteraction, Client } = require("discord.js");
const discordTogether = require("../../Client/DiscordTogether");

module.exports = {
    name : "together",
    description : "Watch youtube in a voice channel together !",
    options : [
        {
            name: "channel",
            description: "Channel you want to activite this activity",
            type: "CHANNEL",
            required: true,
        },
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} Interaction 
     * @param {String[]} args 
     */
    run: async(client, interaction, args) => {
        const [ channelID ] = args;
        const channel = interaction.guild.channels.cache.get(channelID);

        if (channel.type !== "GUILD_VOICE")
            return interaction.followUp({
                content: "Please choose a voice channel",
            });
        discordTogether
            .createTogetherCode(channelID, "youtube")
            .then((x) => interaction.followUp(x.code));
    }
}