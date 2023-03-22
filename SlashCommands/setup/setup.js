const types = require("../../arg_type.json");
const { 
    Client, 
    Message,
    MessageActionRow,
    MessageButton,
    ButtonInteraction,
} = require("discord.js");

const fetch = require("node-fetch");

async function log(interaction){
    try {
        
    } catch (err) {console.log(err); {return "Try again"}}
}

async function meme(message, interaction){
    try{
        const interactionUserId = message.user.id;
        //Buttons
        const but = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("True")
                .setLabel("True")
                .setStyle("SUCCESS"),
            new MessageButton()
                .setCustomId("False")
                .setLabel("False")
                .setStyle("DANGER")
        );
    } catch (err) {console.log(err); {return "Try again"}}
}

/*async function spacenews(interaction){
    try{
        
    } catch (err) {console.log(err); {return "Try again"}}
}*/

module.exports = {
     name: "setup",
     description: "Setup the bot",
     options: [
         {
            name: 'type',
            description: 'Type of shit to send',
            type: "STRING",
            required: true,
            choices: [
                {
                    name: 'log',
                    value: 'log'
                },
                {
                    name: 'meme',
                    value: 'meme'
                },
            ],
         },
     ],
     /**
     *
     * @param {Client} client
     * @param {Message} interaction
     * @param {String[]} args
     */
     run: async (client, message, interaction) => {
        try {
            const choices = interaction.options.getString("type");
            switch (choices) {
                case 'log': return await log(interaction)
                case 'meme': return await meme(message, interaction)
                //case 'spacenews': return await spacenews()
                default: return "Oups, I don't know about that"
            }
        } catch (e) {console.log(e); return "Oups, I can't do that"}
     },

}