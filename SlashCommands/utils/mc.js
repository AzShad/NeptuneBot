const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const util = require('minecraft-server-util');

module.exports = {
    name: "mc",
    description: "Status of Minecraft server",
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {     
            const options = {
                timeout: 1000 * 1, // timeout in milliseconds
                enableSRV: true // SRV record lookup
            };
            util.status('mc2.proxima-centauri.fr', 25564, options)
                .then((result) => {
                    const emb = new MessageEmbed()
                        .setColor('#059300')
                        .setTitle('MC Server Status')
                        .addField('Server IP', result.srvRecord.host.toString())
                        .addField('Status', "✅ Online ✅")
                        .addField('Online Players', result.players.online.toString())
                        .addField('Max Players',  result.players.max.toString())
                        .addField('Version', result.version.name.toString())
                    interaction.followUp({embeds: [emb]})
                })
                .catch((e) =>{
                    const emb = new MessageEmbed()
                        .setColor('#ff0000')
                        .setTitle('MC Server Status')
                        .addField('Server IP', "mc2.proxima-centauri.fr")
                        .addField('Status',  "❌ Stopped ❌")
                    interaction.editReply({embeds: [emb]});
                })                
    },
};