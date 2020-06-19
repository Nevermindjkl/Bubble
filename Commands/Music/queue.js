const Axios = require('axios');
const Discord = require("discord.js");
const Database = require('firebase-admin');
const search = require('yt-search');


exports.info = {
    name: 'search',
    usage: 'search <args>',
    description: 'Searched music in eh yt lol'
};

exports.run = async (Client, message, args, QueueOptions) => {
    var MusicEmbed = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor(0xFF8C00)
    .setDescription(`It doesn't seem like I'm playing anything!`)
    .setTimestamp()
    .setFooter(`Bubble Assistant`, Client.user.displayAvatarURL());

    var ServerID =  QueueOptions.Activity.get(message.guild.id);
    if (!ServerID) return message.channel.send(MusicEmbed);

    var QueueData = ServerID.Queue;
    var QueueSong = QueueData[0];

    var response = `:pause_button: Now Playing: **${QueueSong.Title}**\n Requested by **${QueueSong.Requester}**\n\n:arrows_clockwise:  Server Queue: \n`;


    for (var i = 1; i < QueueData.length; i++) {

        response += `**[${i}] ${QueueData[i].Title}**\nRequested by **${QueueData[i].Requester}**\n`;

    }
    
    var QueueEmbed = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor(0xFF8C00)
    .setDescription(response)
    .setTimestamp()
    .setFooter(`Bubble Assistant`, Client.user.displayAvatarURL());
    message.channel.send(QueueEmbed)


}