const Axios = require("axios");
const Discord = require("discord.js");
const ytdl = require('ytdl-core');

const ActiveQueue = new Map();
var QueueOptions = {
    Activity: ActiveQueue
}

module.exports = async (Client, message) => {
	if (message.author.bot) return undefined;
    if (message.content.substr(0,1) !== Client.config.DefaultSettings.Prefix) return undefined;
    
	const args = message.content.split(/[ ]+/);
	const command = args[0].substring(1).toLowerCase();
	const cmd = Client.commands.get(command);
	if (!cmd) return undefined;

	cmd.run(Client, message, args, QueueOptions);

};