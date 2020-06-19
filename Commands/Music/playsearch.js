const Axios = require('axios');
const Discord = require("discord.js");
const Database = require('firebase-admin');
const ytdl = require('ytdl-core');

exports.info = {
    name: 'play',
    usage: 'play <link>',
    description: 'Plays music!'
};

exports.run = async (Client, message, args, QueueOptions) => {
   var Premium = true
   var Setup = true

    await Axios.get(`${Client.config.DefaultSettings.DataBaseName}/Servers/${message.guild.id}/ServerSettings.json`)
    .then(function (response) {
       if (response.data == null || response.data.Premium == false && response.data.Setup == true){
           Premium = false
       }
      if (response.data == null || response.data.Premium == true && response.data.Setup == false){
           Setup = false
       }
   })

   if(Setup == false){
    var SetupEmbed = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor(0xFF8C00)
    .setDescription(`It seems like your server hasn't been setup yet! Use the setup command first.`)
    .setTimestamp()
    .setFooter(`Bubble Assistant`, Client.user.displayAvatarURL());
     return message.channel.send(SetupEmbed)
   }

   if(Premium == false){
    var PremiumEmbed = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor(0xFF8C00)
    .setDescription(`Due to many bugs & issues, we had to change our music module to premium until it gets fixed! Sorry :(`)
    .setTimestamp()
    .setFooter(`Bubble Assistant`, Client.user.displayAvatarURL());
     return message.channel.send(PremiumEmbed)
   }

    var Info = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor(0xFF8C00)
    .setTitle(`:musical_note:  Play command`)
    .setDescription(`Play your favorite song with Aurora!.\n\n**Usage**\n\`${Client.config.DefaultSettings.Prefix}play [Link]\``)
    .setTimestamp()
    .setFooter(`Bubble Assistant`, Client.user.displayAvatarURL());
   
    var InactiveVC = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor(0xFF8C00)
    .setDescription(`It seems like you aren't in any active voice channel. Try again later?`)
    .setTimestamp()
    .setFooter(`Bubble Assistant`, Client.user.displayAvatarURL());

    var ActiveVC = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor(0xFF8C00)
    .setDescription(`I'm already in a active voice channel! Maybe try joining them?`)
    .setTimestamp()
    .setFooter(`Bubble Assistant`, Client.user.displayAvatarURL());

    var InactiveURL = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor(0xFF8C00)
    .setDescription(`Mhm.. It seems like you didn't gave me a URL or your url is invalid! I don't like that.`)
    .setTimestamp()
    .setFooter(`Bubble Assistant`, Client.user.displayAvatarURL());
   
    if (!message.member.voice.channel) return message.channel.send(InactiveVC);
    if (!args[0]) return message.channel.send(Info);

    var TempURL = await ytdl.validateURL(args[0].slice(5))
    if (!TempURL) return message.channel.send(InactiveURL)

    var URLInfo = await ytdl.getInfo(args[0].slice(5));
    var QueueData = QueueOptions.Activity.get(message.guild.id) || {};

    if (!QueueData.Connection) QueueData.Connection = await message.member.voice.channel.join();
    if (!QueueData.Queue) QueueData.Queue = [];
    QueueData.ServerID = message.guild.id;

    QueueData.Queue.push({
        Title: URLInfo.videoDetails.title,
        URL: "youtube.com" + args[0],
        Requester: message.author.tag,
        RequesterDefualt: message.author,
        Channel: message.channel.id
    });

    if (!QueueData.dispatcher) {
        Play(Client, QueueOptions, QueueData);
    } else {
        var ActiveRequest = new Discord.MessageEmbed()
        .setAuthor(URLInfo.videoDetails.title, message.author.displayAvatarURL())
        .setColor(0xFF8C00)
        .setDescription(`**${URLInfo.videoDetails.title}** has been added to the queue.\nRequested by: **${message.author.tag}**`)
        .setTimestamp()
        .setFooter(`Bubble Assistant`, Client.user.displayAvatarURL());
        await message.channel.send(ActiveRequest)
 
    }
    QueueOptions.Activity.set(message.guild.id, QueueData);

}

async function Play(Client, QueueOptions, QueueData) {
    var SoundOptions = { seek: 5, volume: 1, bitrate: 128000 };

    var ActiveRequest = new Discord.MessageEmbed()
    .setAuthor(QueueData.Queue[0].Title, QueueData.Queue[0].RequesterDefualt.displayAvatarURL())
    .setColor(0xFF8C00)
    .setDescription(`**${QueueData.Queue[0].Title}** is now playing.\nRequested by: **${QueueData.Queue[0].Requester}**`)
    .setTimestamp()
    .setFooter(`Bubble Assistant`, Client.user.displayAvatarURL());
    await Client.channels.cache.get(QueueData.Queue[0].Channel).send(ActiveRequest)

    QueueData.dispatcher = await QueueData.Connection.play(ytdl(QueueData.Queue[0].URL, { filter: "audioonly" }), SoundOptions);
    QueueData.dispatcher.ServerID = QueueData.ServerID;

    QueueData.dispatcher.on('finish', function () {
        Finish(Client, QueueOptions, this); 
    });
}

function Finish(Client, QueueOptions, Dispatcher) {
 
    var FetchedQueueData = QueueOptions.Activity.get(Dispatcher.ServerID);
    FetchedQueueData.Queue.shift();
 
    if (FetchedQueueData.Queue.length > 0) {
        QueueOptions.Activity.set(Dispatcher.ServerID, FetchedQueueData);
        Play(Client, QueueOptions, FetchedQueueData);
 
    } else { 
 
        QueueOptions.Activity.delete(Dispatcher.ServerID);
        var VoiceChannel = Client.guilds.cache.get(Dispatcher.ServerID).me.voice.channel;
        if (VoiceChannel) return VoiceChannel.leave();
 
    }
}