const fetch = require('node-fetch');
const { EmbedBuilder } = require("discord.js");
const DiscordJS = require('discord.js');

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

module.exports = {
  test: true,
  data: new DiscordJS.SlashCommandBuilder()
    .setName('nasa')
    .setDescription('Show an image randomly from nasa database'),

  async execute({ interaction }) {
    const imageUrl = await getNasaImage();
    const embed = new EmbedBuilder()
      .setTitle('Image aléatoire de la NASA')
      .setImage(imageUrl);
    interaction.reply({ embeds: [embed] });
  },
};