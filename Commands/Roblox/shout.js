const Axios = require('axios');
const Discord = require("discord.js");
const RobloxAPI = require("noblox.js")
const Database = require('firebase-admin');

exports.info = {
    name: 'shout',
    usage: 'shout <args>',
    description: 'Shouts to the group'
};

exports.run = async (Client, message, args) => {
    await Axios.get(`${Client.config.DefaultSettings.DataBaseName}/Servers/${message.guild.id}/ServerModerators/${message.author.id}.json`)
    .then(function (response) {
       if(response.data == null){
        var CommandsEmbed = new Discord.MessageEmbed()
        .setColor(0xFF8C00)
        .setAuthor(message.author.username, message.author.displayAvatarURL())
		.setDescription(`It seems like you haven't got any permissions! This command is moderator+!`)
        .setTimestamp()
        .setFooter(`Bubble Assistant`, Client.user.displayAvatarURL());
       return message.channel.send(CommandsEmbed)
       }
      if(response.data.UserRole === "Owner" || "Developer" || "Adminstrator" || "Moderator"){
          var TempMessage = args.join(' ').slice(7)

        var ShoutEmbed = new Discord.MessageEmbed()
        .setColor(0xFF8C00)
        .setAuthor(message.author.username, message.author.displayAvatarURL())
		.setDescription(`I've shouted your message!`)
        .setTimestamp()
        .setFooter(`Bubble Assistant`, Client.user.displayAvatarURL());

          RobloxAPI.shout(5726613, TempMessage).catch(console.error).then(message.channel.send(ShoutEmbed))
      }
   })
}