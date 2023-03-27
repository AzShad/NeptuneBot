const { Client, Intents, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios');
const he = require('he');
const DiscordJS = require('discord.js');

module.exports = {
    test: true,
    data: new DiscordJS.SlashCommandBuilder()
      .setName('trivia')
      .setDescription('Answer to some questions'),
      
    async execite({interaction}){
        try {
            const response = await axios.get('https://opentdb.com/api.php?amount=1&type=boolean');
            const question = response.data.results[0];
      
            const row = new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setCustomId('true')
                  .setLabel('True')
                  .setStyle('PRIMARY'),
                new MessageButton()
                  .setCustomId('false')
                  .setLabel('False')
                  .setStyle('DANGER')
              );
      
            await interaction.reply({
                content: `**Question: ${he.decode(question.question)}**\nAnswer to the question with the button under.`,
                components: [row],
                ephemeral: false,
            });
      
            const filter = (i) => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 15000 });
      
            collector.on('collect', async (i) => {
              if (i.customId === question.correct_answer.toLowerCase()) {
                await i.update({ content: 'Right Answer!', components: [] });
              } else {
                await i.update({ content: `Wrong Answer! The right answer was: ${question.correct_answer}`, components: [] });
              }
              collector.stop();
            });
      
            collector.on('end', async (collected) => {
              if (collected.size === 0) {
                await interaction.editReply({ content: `Elapsed times! The right answer was: ${question.correct_answer}`, components: [] });
              }
            });
      
          } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Error. please try again later.', ephemeral: true });
          }
    },
};