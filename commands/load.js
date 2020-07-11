const fs = require('fs');
module.exports = {
	name: 'load',
	description: 'Reloads a command',
	args: true,
    usage: "<cmd name>",
	execute(message, args) {
		var f;
		fs.readdir('./commands/', (err, files) => {
			for (var file of files){
				if (file.endsWith(commandName + '.js')) {
                    f = file;
                }
			}
            if (!f){
                return message.channel.send("Command not found...")
            }
			try {
				const newCommand = require(`./commands/${f}.js`);
				message.client.commands.set(newCommand.name, newCommand);
			} catch (error) {
				console.log(error);
				return message.channel.send(`There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``);
			}
			message.channel.send(`Command \`${commandName}\` has been reloaded!`);
		});
	},
};
