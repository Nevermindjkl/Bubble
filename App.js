const Discord = require('discord.js');
const Roblox = require('noblox.js');

const Database = require('firebase-admin');
const Enmap = require("enmap");
const cron = require('node-cron');
const fs = require("fs");

var DataStoreAuthentication = require('./ClientSettings/ServiceAccount.json')
var ClientSettings = require('./ClientSettings/Client.json')

const Client = new Discord.Client();
Client.config = ClientSettings;
Client.commands = new Enmap();

var loggedIn = false

Database.initializeApp({
    credential: Database.credential.cert(DataStoreAuthentication),
    databaseURL: `${ClientSettings.DefaultSettings.DataBaseName}`
});

async function RobloxLogin(){
    await Roblox.setCookie(ClientSettings.RToken);
    console.log('logged in roblox')
    loggedIn = true
}
RobloxLogin();

fs.readdir("./Events/", (err, files) => {
    files.forEach(file => {
      const event = require(`./Events/${file}`);
      let eventName = file.split(".")[0];
      Client.on(eventName, event.bind(null, Client));
    });
  });

fs.readdir("./Commands/Misc", (Errors, Files) => {
  console.log(`- Loading Misc commands -`)
  Files.forEach(File => {
      if (!File.endsWith(".js")) return;
      let props = require(`./Commands/Misc/${File}`);
      let commandName = File.split(".")[0];

      Client.commands.set(commandName, props);
      console.log(`Loaded • Misc: ${commandName}`)
    });
  });

  fs.readdir("./Commands/Music", (Errors, Files) => {
    console.log(`- Loading Music commands -`)
    Files.forEach(File => {
        if (!File.endsWith(".js")) return;
        let props = require(`./Commands/Music/${File}`);
        let commandName = File.split(".")[0];
  
        Client.commands.set(commandName, props);
        console.log(`Loaded • Music: ${commandName}`)
      });
    });

    fs.readdir("./Commands/Roblox", (Errors, Files) => {
      console.log(`- Loading Roblox commands -`)
      Files.forEach(File => {
          if (!File.endsWith(".js")) return;
          let props = require(`./Commands/Roblox/${File}`);
          let commandName = File.split(".")[0];
    
          Client.commands.set(commandName, props);
          console.log(`Loaded • Roblox: ${commandName}`)
        });
      });
    
      cron.schedule('* */1 * * *', () => {
        if (loggedIn == true) {
          loggedIn = false
          Roblox.refreshCookie().then(function(newCookie) {
            ClientSettings.RToken = newCookie
            RobloxLogin();
            console.log("Cookie refreshed, validated and relogged in.")
          })
        }
      });

Client.login(ClientSettings.DToken);