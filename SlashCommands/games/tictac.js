/*const TicTacToe = require("discord-tictactoe");
const game = new TicTacToe({ language: "en"});
const { CommandInteraction } = require("discord.js");

module.exports = {
    name: "tictactoe",
    description: "Start the game tic tac toe !",
    type: "CHAT_INPUT",

    run: async ({ interaction }) => {
        game.handleInteraction(interaction);
    },
};

const { Client, CommandInteraction } = require("discord.js");

module.exports = {
    name: "ping",
    description: "returns websocket ping",
    type: 'CHAT_INPUT',

    run: async (client, interaction, args) => {
        interaction.followUp({ content: `${client.ws.ping}ms!` });
    },
};*/