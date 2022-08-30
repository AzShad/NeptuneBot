const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({ language: "en", commandOptionName: 'user'});
const discord = require("discord.js");

module.exports = {
    name: "tictactoe",
    description: "Start the game tic tac toe !",
    type: "CHAT_INPUT",
    options: [
        {
            name: 'user',
            description: 'Who you want to play with',
            type: 'USER',
            required: false
        }
    ],
    run: async (client, interaction ) => {
        game.handleInteraction(interaction);
    },
};