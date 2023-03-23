const fetch = require('node-fetch');
const { MessageEmbed } = require("discord.js");
const axios = require('axios');

module.exports ={
    name: "schedule",
    description: "Show the next schedule launch",

    run: async(client, interaction, args) => {
        const days = interaction.options.getInteger(30);
        const date = new Date();
        const endDate = new Date(date.setDate(date.getDate() + days)).toISOString().slice(0, 10);
        const url = `https://launchlibrary.net/1.4/launch/${endDate}?mode=verbose`;

        try {
            const response = await axios.get(url);
            const launches = response.data.launches;
            console.log(response);
            console.log(response.data.launches);
            console.log(launches);
            if (!launches || launches.length === 0) {
                await interaction.followUp('Il n\'y a pas de lancements de fusées prévus dans les prochains jours.');
                return;
            }
            const launchList = launches.map(launch => `**${launch.name}** le ${launch.net}`).join('\n');
            await interaction.deferReply();
            await interaction.followUp(`Les lancements de fusées prévus dans les prochains jours sont :\n${launchList}`);
        } catch (error) {
            console.error(error);
            await interaction.followUp('Une erreur est survenue lors de la récupération des lancements de fusées.');
        }
    },
};