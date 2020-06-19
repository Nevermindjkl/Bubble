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
    search(args.join(' ').slice(6), function (err, res) {
    if (err) return console.log("error");


    var videos = res.videos.slice(0, 10);
    var response = '';
    for (var i in videos) {

        response += `**[${parseInt(i) + 1}]:** ${videos[i].title} \r\n`;

    }

    response += `Choose between 1-${videos.length}.`;

    const YTList = new Discord.MessageEmbed()
    .setAuthor(`Searchlist`)
    .setColor(0xFF8C00)
    .setDescription(response)
    .setFooter("Bubble Assistant")
    .setTimestamp();

    message.channel.send(YTList);
    const filter = music => !isNaN(music.content) && music.content < videos.length + 1 && music.content > 0;
    const collection = message.channel.createMessageCollector(filter);
    collection.videos = videos;
    collection.once('collect', function (music) {
        var PlayFile = require('./playsearch.js');
        PlayFile.run(Client, message, [this.videos[parseInt(music.content) - 1].url], QueueOptions, args);

    });

});

}