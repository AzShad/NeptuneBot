const { Message, Client } = require("discord.js");

module.exports = {
    name: "dailyMeme",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const subReddits = ["meme","memes"];
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];
        const reddit = await fetch(`https://www.reddit.com/r/${random}/top/.json?sort=top&t=day`).then(res => res.json())
        const img = reddit.data.children[Math.floor(Math.random() * reddit.data.children.length)].data.url;
        message.channel.cache.get("195553348835999745").send(img);
    },
};
