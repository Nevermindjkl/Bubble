module.exports = async Client => {
    let ActivNum = 0;

    setInterval(function() {
        if (ActivNum === 0) {
          Client.user.setActivity("Bubble Assistant | Alpha", {type: "WATCHING"});
            ActivNum = 1; 
        } else if (ActivNum === 1) {
          Client.user.setActivity(`${Client.guilds.cache.size} Server(s)!`, {type: "WATCHING"})
            ActivNum = 2;
        } else if (ActivNum === 2) {
          Client.user.setActivity(`${Client.users.cache.size} User(s)!`, {type: "LISTENING"})
            ActivNum = 0;
        }
    }, 3 * 1000);
};