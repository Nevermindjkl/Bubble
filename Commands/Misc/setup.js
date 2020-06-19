const Axios = require('axios');
const Discord = require("discord.js");
const Database = require('firebase-admin');


exports.info = {
    name: 'setup',
    usage: 'setup',
    description: 'Starts the setup of the bot'
};

exports.run = async (Client, message, args) => {

    var ClientDatabase = Database.database();
    var VerifiedStatus = true;
    var SetupStatus = true;
    var SerialCode;

    var GroupName 
    var GroupId 
    var GroupOwner 
    var GroupOwnerId 
    var GroupCreated 
    var GroupMemberCount
    var GroupIcon
    var GroupDescription

    var Token = args[1]
    var TempGroupId = args[2]

    var Info = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor(0xFF8C00)
    .setTitle(`:hammer_pick: Setup command`)
    .setDescription(`The setup command is used for a new server or transfer ownership.\n\n**Usage**\n\`${Client.config.DefaultSettings.Prefix}setup [Serial Code] [GroupId]\``)
    .setTimestamp()
    .setFooter(`BubbleAssistant`, Client.user.displayAvatarURL());
    
	var DmError = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setDescription(`Hey there! ${Client.config.DefaultSettings.Prefix}setup isn't a dm command. Please try in a server channel!`)
    .setTimestamp()
    .setFooter(`BubbleAssistant`, Client.user.displayAvatarURL());

    var OwnerError = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor(0xFF8C00)
    .setDescription(`:wave: Hey there! For security reasons we only let the server owner do the setup command.`)
    .setTimestamp()
    .setFooter(`BubbleAssistant`, Client.user.displayAvatarURL());

    var TokenError = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor(0xFF8C00)
    .setDescription(`Hey ${message.author}! You didn't include any sort of serial code.\n\`[Serial Code] [GroupId]\` `)
    .setTimestamp()
    .setFooter(`BubbleAssistant`, Client.user.displayAvatarURL());

    var GroupError = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor(0xFF8C00)
    .setDescription(`Hey ${message.author}! You didn't include any GroupId Use the format!\n\`[Serial Code] [GroupId]\` `)
    .setTimestamp()
    .setFooter(`BubbleAssistant`, Client.user.displayAvatarURL());
    
    if (message.channel.type === "dm") return message.author.send(DmError);
   // if (message.author.id !== message.guild.owner.id) return message.channel.send(OwnerError);
    if(!args[1]) return message.channel.send(Info)
    message.delete()


    await Axios.get(`${Client.config.DefaultSettings.DataBaseName}/VerifiedUsers/${message.author.id}.json`)		
        .then(function (response) {
			if (response.data == null){
				VerifiedStatus = false
			}else{
            SerialCode = response.data.SerialCode
            }
		}).catch(function (error) {
			console.log(`Error - ${error} (setup.js)`)
    });
        
    if(Token !== SerialCode) return message.channel.send(TokenError)
    if(!TempGroupId) return message.channel.send(GroupError)

    await Axios.get(`${Client.config.DefaultSettings.DataBaseName}/Servers/${message.guild.id}/ServerSettings.json`)
    .then(function (response) {
       if (response.data == null || response.data.Setup == false){
           SetupStatus = false;
       }
   })

    await Axios.get(`https://groups.roblox.com/v1/groups/${TempGroupId}`)
    .then(function (response) {
        if (response.data.id == TempGroupId){
            GroupName = response.data.name
            GroupId = response.data.id
            GroupOwner = response.data.owner.username
            GroupOwnerId = response.data.owner.userId
            GroupCreated = response.data.shout.created
            GroupMemberCount = response.data.memberCount
            GroupDescription = response.data.description

            var AwaitingEmbed = new Discord.MessageEmbed()
            .setColor(0xFF8C00)
            .setDescription(`Please wait while I fetch your data`)
            .setTimestamp()
            .setFooter(`BubbleAssistant`, Client.user.displayAvatarURL());
            message.channel.send(AwaitingEmbed).then(async (AwaitingEmbed) => { 
                AwaitingEmbed.delete()
                var GroupEmbed = new Discord.MessageEmbed()
                 .setAuthor(GroupName, message.author.displayAvatarURL())
                 .setColor(0xFF8C00)
                 .setThumbnail(GroupIcon)
                 .setDescription(`We aren't sure if this is your group. \n Please use the reactions (React 💣 if you want to clear cache or resetup)!`)
                 .addField(`Owner`, `The current owner is \`${GroupOwner}\` and has id as \`${GroupOwnerId}\`.`, false)
                 .addField(`Description`, GroupDescription, false)
                 .addField('GroupId', GroupId, true)
                 .addField('Created', GroupCreated, true)
                 .addField('MemberCount', GroupMemberCount, true)
                 .setTimestamp()
                 .setFooter(`BubbleAssistant`, Client.user.displayAvatarURL());
    
                 const UserFilter = (reaction, user) => {
                    return ['✅', '❎', '💣'].includes(reaction.emoji.name) && user.id === message.author.id;
                };
    
                 message.channel.send(GroupEmbed).then(async (Group) => { 
                    await Group.react("✅");
                    await Group.react("❎");
                    await Group.react("💣");
    
                    Group.awaitReactions(UserFilter, { max: 1, time: 60000, errors: ['time'] })
                       .then(collected => {
                           const reaction = collected.first();
    
                            if (reaction.emoji.name === '✅') {
                                Group.delete().catch(error => console.error('Failed to clear: ', error));
                                if(SetupStatus == false) {
                                    ClientDatabase.ref(`Servers/${message.guild.id}/ServerSettings`).set({
                                            OwnerId: Number(message.author.id),
                                            Prefix: "!",
                                            Setup: true,
                                            Premium: false
                                        })
                                    ClientDatabase.ref(`Servers/${message.guild.id}/ServerRobloxInfo`).set({
                                            GroupId: Number(GroupId),
                                            GroupName: GroupName,
                                            GroupOwner: GroupOwnerId,
                                 
                                        })
                                 
                                    ClientDatabase.ref(`Servers/${message.guild.id}/ServerModerators/${message.author.id}`).set({
                                            UserId: Number(message.author.id),
                                            UserRole: "Owner",
                                 
                                        })
                                    var AwaitingEmbed = new Discord.MessageEmbed()
                                     .setColor(0xFF8C00)
                                     .setDescription(`:partying_face: Your server has been setup! Thank you for using ${Client.user.username}!`)
                                     .setTimestamp()
                                     .setFooter(`BubbleAssistant`, Client.user.displayAvatarURL());
                                     message.channel.send(AwaitingEmbed)
                                    }
                                    if(SetupStatus == true){
                                        var AwaitingEmbed = new Discord.MessageEmbed()
                                        .setColor(0xFF8C00)
                                        .setDescription(`Your server has already been setup before! Would you like your server to be setup again?`)
                                        .setTimestamp()
                                        .setFooter(`BubbleAssistant`, Client.user.displayAvatarURL());
                                        message.channel.send(AwaitingEmbed)
                                       }

                            }

                            if (reaction.emoji.name === '💣') {
                                Group.delete().catch(error => console.error('Failed to clear: ', error));
                                if(SetupStatus == true) {
                                    ClientDatabase.ref(`Servers/${message.guild.id}/ServerSettings`).set({
                                            OwnerId: "0",
                                            Prefix: "!",
                                            Setup: false,
                                            Premium: false
                                        })
                                    ClientDatabase.ref(`Servers/${message.guild.id}/ServerRobloxInfo`).set({
                                            GroupId: "0",
                                            GroupName: "0",
                                            GroupOwner: "0",
                                 
                                        })
                                 
                                    ClientDatabase.ref(`Servers/${message.guild.id}/ServerModerators/${message.author.id}`).set({
                                            UserId: "0",
                                            UserRole: "0",
                                 
                                        })
                                    var AwaitingEmbed = new Discord.MessageEmbed()
                                     .setColor(0xFF8C00)
                                     .setDescription(`:partying_face: I have cleared my database! Reuse the command to setup!`)
                                     .setTimestamp()
                                     .setFooter(`BubbleAssistant`, Client.user.displayAvatarURL());
                                     message.channel.send(AwaitingEmbed)
                                    }
                                  if(SetupStatus == false){
                                        var AwaitingEmbed = new Discord.MessageEmbed()
                                        .setColor(0xFF8C00)
                                        .setDescription(`I cannot delete any cache! Maybe you didn't setup before?`)
                                        .setTimestamp()
                                        .setFooter(`BubbleAssistant`, Client.user.displayAvatarURL());
                                        message.channel.send(AwaitingEmbed)
                                       }

                            } 
                            if (reaction.emoji.name === '❎') {
                                Group.delete().catch(error => console.error('Failed to clear: ', error));
                        var AwaitingEmbed = new Discord.MessageEmbed()
                        .setColor(0xFF8C00)
                        .setDescription(`I have canceld the command and reported the issue to the support server. Our engineers will send a message soon!`)
                        .setTimestamp()
                        .setFooter(`BubbleAssistant`, Client.user.displayAvatarURL());
                        message.channel.send(AwaitingEmbed);
                            }
                        })
                       .catch(collected => {
                        Group.awaitReactions(UserFilter, { max: 1, time: 60000, errors: ['time'] })
                        var AwaitingEmbed = new Discord.MessageEmbed()
                        .setColor(0xFF8C00)
                        .setDescription(`You haven't reacted, I have canceld the command.`)
                        .setTimestamp()
                        .setFooter(`BubbleAssistant`, Client.user.displayAvatarURL());
                        message.channel.send(AwaitingEmbed)
                       });
    
        
                    })
                })
            }
        
        }).catch(function (error) {
            console.log(`Error - ${error} (setup.js)`)
            message.channel.send("error")
        })
    




};
