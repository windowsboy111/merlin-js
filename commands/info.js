const fs = require('fs');
const Discord = require('discord.js');
module.exports = {
	name: 'info',
	description: 'List info about the bot',
	aliases: ['i'],
	cooldown: 5,
	execute(message, args) {
        var obj = JSON.parse(fs.readFileSync('file', 'utf8'));
        embed = new Discord.MessageEmbed()
        Object.keys(obj).forEach( (key) => {
			embed.addField(key, obj[key], true)
		});
		message.channel.send(embed)
    }
}
