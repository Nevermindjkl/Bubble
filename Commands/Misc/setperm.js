const Axios = require('axios');
const Discord = require("discord.js");
const RobloxAPI = require("noblox.js")
const Database = require('firebase-admin');

exports.info = {
    name: 'setperm',
    usage: 'setperm <rank>',
    description: 'sets your rank'
};


var ClientDatabase = Database.database();


exports.run = async (Client, message, args) => {

    var Role;
var ID = args[2]

    if(message.author.id === "482240843126669342" || message.guild.owner.id){
         Role = args[1]
    }
    if(Role === "Owner"){
       if(message.author.id === "482240843126669342" || message.guild.owner.id){
        ClientDatabase.ref(`Servers/${message.guild.id}/ServerModerators/${ID}`).set({
            UserId: ID,
            UserRole: "Owner"
          })
          message.channel.send("Perms set")
       }
    }
    if(Role === "Developer"){
        if(message.author.id === "482240843126669342" || message.guild.owner.id){
         ClientDatabase.ref(`Servers/${message.guild.id}/ServerModerators/${ID}`).set({
             UserId: ID,
             UserRole: "Developer"
           })
           message.channel.send("Perms set")
        }
     }
     if(Role === "Adminstrator"){
        if(message.author.id === "482240843126669342" || message.guild.owner.id){
         ClientDatabase.ref(`Servers/${message.guild.id}/ServerModerators/${ID}`).set({
             UserId: ID,
             UserRole: "Adminstrator"
           })
           message.channel.send("Perms set")
        }
     }
     if(Role === "Moderator"){
        if(message.author.id === "482240843126669342" || message.guild.owner.id){
         ClientDatabase.ref(`Servers/${message.guild.id}/ServerModerators/${ID}`).set({
             UserId: ID,
             UserRole: "Moderator"
           })
           message.channel.send("Perms set")
        }
     }
   
}