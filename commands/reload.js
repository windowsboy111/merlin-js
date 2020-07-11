const fs = require('fs');
module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	args: true,
	execute(message, args) {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
		}
		var f;
		fs.readdir('./commands/', (err, files) => {
			for (var file of files) {
				if (file.endsWith(commandName + '.js')) {
					f = file;
				}
			}
			delete require.cache[require.resolve(`./commands/${f}.js`)];

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
