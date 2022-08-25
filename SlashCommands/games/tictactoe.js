const TicTacToe = require('discord-tictactoe');
const { Interaction } = require('discord.js');
const game = new TicTacToe({ language: "en"});

module.exports = {
    name: "tictactoe",
    description: "Start the game tic tac toe !",
    type: "CHAT_INPUT",
    options: [
        {
            name: 'opponent',
            description: 'Who you want to play with',
            type: 'USER',
            required: false
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {String[]} args
     */
    run: async ({ interaction }) => {
        game.handleInteraction(interaction);
    },
};