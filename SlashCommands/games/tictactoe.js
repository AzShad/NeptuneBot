const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({ language: "en", commandOptionName: 'user'});
const DiscordJS = require('discord.js');

module.exports = {
    test: true,
    data: new DiscordJS.SlashCommandBuilder()
        .setName('tictactoe')
        .setDescription('Start the game tic tac toe !')
        .addUserOption(option => option.setName('user').setDescription('Who you want to play with').setRequired(false)),

    async execute({interaction}){
        game.handleInteraction(interaction);
    },
};