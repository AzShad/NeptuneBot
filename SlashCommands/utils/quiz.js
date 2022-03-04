const { 
    Client, 
    Message,
    MessageActionRow,
    MessageButton,
    ButtonInteraction,
} = require("discord.js");

const fetch = require("node-fetch");

module.exports = {
    name: "quiz",
    description: "Answer to the question !",
    /**
     *
     * @param {Client} client
     * @param {Message} interaction
     * @param {String[]} args
     */
    run: async (client, message, args) => {
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
        //Question
        const response = await fetch('https://opentdb.com/api.php?amount=1&category=18&type=boolean');
        const data = await response.json();
        var length = data.results.length;
        var randomNumber = Math.floor(Math.random() * length);
        var randomQuestion = data.results[randomNumber];
        var question = randomQuestion.question;
        var correctAnswer = randomQuestion.correct_answer;
        console.log(correctAnswer);

        //Display
        message.followUp({
            content: question, 
            components: [but] 
        });
        //user click response
        const filter = (interaction) => {
            if(interaction.user.id === interactionUserId) return true;
            return interaction.reply({content: "You can't use this button"})
        };
        //Response max
        const collector = message.channel.createMessageComponentCollector({
            filter, 
            max: 1
        });
        
        collector.on('end', (ButtonInteraction) => {
            const id = ButtonInteraction.first().customId;

            if (id === "True" && correctAnswer === "True") {
                return ButtonInteraction.first().reply("You got it correct !")
            }
            if (id === "False") return ButtonInteraction.first().reply("Wrong answer !")
        })
    },
};