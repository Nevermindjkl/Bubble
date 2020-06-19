const Axious = require('axios');
const Discord = require("discord.js");


exports.run = async (Client, message, args) => {

	var CommandsEmbed = new Discord.MessageEmbed()
        .setColor(0xFF8C00)
        .setAuthor(message.author.username, message.author.displayAvatarURL())
		.setDescription(`Bubble has a lot of commands you can use/view. If you want to view the usage of a command use. \n Example: \`${Client.config.DefaultSettings.Prefix}setup\``)
        .setTimestamp()
        .setFooter(`Bubble Assistant`, Client.user.displayAvatarURL());
    message.channel.send(CommandsEmbed)
    
    


	
};

exports.info = {
    name: 'commands',
    usage: 'commands',
    description: 'Shows a list of commands'
};