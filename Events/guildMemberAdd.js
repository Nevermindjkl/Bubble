module.exports = async Client => {
    Client.channels.get('716323286879043614').setName(`Server Count: ${member.guild.memberCount}`)
};