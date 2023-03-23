const fetch = require('node-fetch');
const { MessageEmbed } = require("discord.js");

const nasaApiKey = 'Q4KHgB6NxgWz1DG8G8209ngvG2eA7mGctxMF7Dky';

async function getNasaImage() {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}&date=${randomDate()}`);
  const data = await response.json();
  return data.url;
}

function randomDate() {
    const start = new Date(2010, 1, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().slice(0, 10);
  }

module.exports ={
    name: "nasa",
    description: "Show an image randomly from nasa database",

    run: async(client, interaction, args) => {
        const imageUrl = await getNasaImage();
        const embed = new MessageEmbed()
        .setTitle('Image aléatoire de la NASA')
        .setImage(imageUrl);
        interaction.followUp({ embeds: [embed] });
    },
};