//const colors = require("../../colors.json");
const types = require("../../arg_type.json");

const fetch = require("node-fetch");

async function meme(interaction){
    try{
        const subReddits = ["meme","memes"];
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];
        const reddit = await fetch(`https://www.reddit.com/r/${random}/top/.json?sort=top&t=day`).then(res => res.json())
        const img = reddit.data.children[Math.floor(Math.random() * reddit.data.children.length)].data.url;
        interaction.channel.send(img);
    } catch (err) {console.log(err); {return "Try again"}}
}

module.exports = {
     name: "meme",
     description: "Send a meme",
     options: [
         {
            name: 'type',
            description: 'Type of shit to send',
            type: "STRING",
            required: true,
            choices: [
                {
                    name: 'meme',
                    value: 'meme'
                },
                {
                    name: 'techmemes',
                    value: 'techmemes'
                },
            ],
         },
     ],

     run: async (client, interaction) => {
        try {
            const choices = interaction.options.getString("type");
            switch (choices) {
                case 'meme': return await meme(interaction)
                case 'techmemes': return await techmemes()
                default: return "Oups, I don't know about that"
            }
        } catch (e) {console.log(e); return "Oups, I can't do that"}
     },

}
