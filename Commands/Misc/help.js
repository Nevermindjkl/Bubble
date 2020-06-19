const Axious = require('axios');
const Discord = require("discord.js");

exports.run = async (Client, message, args) => {

	
	var HelpEmbed = new Discord.MessageEmbed()
        .setColor(0xFF8C00)
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .addField(`Commands`, `Use \`${Client.config.DefaultSettings.Prefix}commands\` to get a full list of our commands.`, false)
        .addField(`Bubble Server(s)`, Client.guilds.cache.size, true)
        .addField(`Bubble User(s)`, Client.users.cache.size, true)
        .addField(`Memory Usage`, `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
        .setTimestamp()
        .setFooter(`Bubble Assistant`, Client.user.displayAvatarURL());
	await message.channel.send(HelpEmbed)


	
};

exports.info = {
    name: 'help',
    usage: 'help',
    description: 'Important information'
};