//const colors = require("../../colors.json");
const types = require("../../arg_type.json");

const fetch = require("node-fetch");
const DiscordJS = require('discord.js');
const { execute } = require("./nuke");

async function meme(client, interaction, channelID=null){
    try{
        const subReddits = ["meme", "memes"];
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];
        const reddit = await fetch(`https://www.reddit.com/r/${random}/top/.json?sort=top&t=day`).then(res => res.json())
        const img = reddit.data.children[Math.floor(Math.random() * reddit.data.children.length)].data.url;

        
        const embed = new DiscordJS.EmbedBuilder()
            .setColor("00FF00")
            .setImage(img)
            .setTitle(`From reddit.com/r/${random}`)
            .setURL(`https://reddit.com/r/${random}`)
        if (img.endsWith("mp4") || img.endsWith("gif")) { 
            if (!channelID){await interaction.reply(img)}
            else client.channels.cache.get(channelID).send(img)
            return 
        }
        if (!channelID){await interaction.reply({embeds: [embed]})}
        else client.channels.cache.get(channelID).send({embeds: [embed]})
    } catch (err) {console.log(err); {return "Try again"}}
}

module.exports = {
    data: new DiscordJS.SlashCommandBuilder()
        .setName('meme')
        .setDescription('Send a meme'),

     async execute({client, interaction, options}){
        try {
            if (options) meme(client, null, options)
            else meme(client, interaction)
        } catch (e) {console.log(e); return "Oups, I can't do that"}
     },

}
