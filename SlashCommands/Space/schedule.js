const fetch = require('node-fetch');
const { MessageEmbed } = require("discord.js");
const axios = require('axios');

async function getUpcomingLaunches() {
    const url = 'https://ll.thespacedevs.com/2.0.0/launch/upcoming/';
    const response = await fetch(url);
    const data = await response.json();
    const currentTime = new Date();
    return data.results.filter(launch => new Date(launch.window_start) > currentTime);
}
  
function createLaunchEmbed(launches) {
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Prochains lancements de fusées')
      .setURL('https://thespacedevs.com/ll')
      .setThumbnail('https://thespacedevs.com/static/home/img/favicon/favicon-32x32.png')
      .setDescription('Voici la liste des prochains lancements de fusées :');
  
    launches.forEach((launch) => {
      const date = new Date(launch.window_start).toLocaleString();
      embed.addFields({
        name: `${launch.name}`,
        value: `${date}\n${launch.pad.location.name}`,
      });
    });
    //console.log(embed);
    return embed;
  }

module.exports ={
    name: "schedule",
    description: "Show the next schedule launch",

    run: async(client, interaction, args) => {
        const launches = await getUpcomingLaunches();
        const embed = createLaunchEmbed(launches);
        await interaction.followUp({ embeds: [embed] });
    },
};