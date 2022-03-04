const { glob } = require("glob");
const { promisify } = require("util");
const { Client, Interaction, MessageEmbed } = require("discord.js");
const Discord = require("discord.js");

var cron = require('node-cron');
const fetch = require("node-fetch");
const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    // Commands
    const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }
    });

    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));

    // Slash Commands
    const slashCommands = await globPromise(
        `${process.cwd()}/SlashCommands/*/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });
    client.on("ready", async () => {
        // Register for a single guild
        await client.guilds.cache
            .get("195553348835999745")
            .commands.set(arrayOfSlashCommands);

        // Register for all the guilds the bot is in
        // await client.application.commands.set(arrayOfSlashCommands);
    });


    //daily meme
    cron.schedule('0 13 * * *', async()  => {   
        const subReddits = ["meme", "memes"];
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];
        const reddit = await fetch(`https://www.reddit.com/r/${random}/top/.json?sort=top&t=day`).then(res => res.json())
        const img = reddit.data.children[Math.floor(Math.random() * reddit.data.children.length)].data.url;
        // const img = await random_search(random);
        const embed = new MessageEmbed()
            .setColor("00FF00")
            .setImage(img)
            .setTitle(`From reddit.com/r/${random}`)
            .setURL(`https://reddit.com/r/${random}`)
        if (img.endsWith("mp4") || img.endsWith("gif")) { client.channels.cache.get("195553348835999745").send(img); return }
        client.channels.cache.get("195553348835999745").send({embeds: [embed]})
    });
        //log
    /*client.on("voiceStateUpdate", (oldMember, newMember) => {
        let oldV = oldMember.channel;
        let newV = newMember.channel;
        const guild = client.guilds.fetch(newMember.guild.id);
        const log = guild.catch(chan => chan.name === "logs" && chan.type === "text");
        if (!log) {return}
        var embed = new Discord.MessageEmbed().setTitle("Connection Logs").setTimestamp()
        .setThumbnail(client.users.cache.get(newMember.id).avatarURL({ dynamic: true, format: 'png', size: 64 }))
    
        if (oldV != newV) {
            if (oldV == null) {
                embed.setColor(colors.green)
                .setDescription(`🔊${newMember.member} **joined\nchannel:** \`${newV.name}\``)
            } else if (newV == null) {
                embed.setColor(colors.red)
                .setDescription(`${newMember.member} **left\nchannel:** \`${oldV.name}\``)
                if (oldV.members.size == 0)
                    try {client.botcommands.get('delete_channels').run(newMember.guild)} catch {}
            } else {
                embed.setColor(colors.yellow)
                .setDescription(`💨${newMember.member} **moved\nfrom:** \`${oldV.name}\` **\nto:** \`${newV.name}\``)
                if (oldV.members.size == 0)
                    try {client.botcommands.get('delete_channels').run(newMember.guild)} catch {}
            }
            log.send({embeds: [embed]});
        }
    });*/
};
