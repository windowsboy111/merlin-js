// => runtime: author machine extra settings
process.chdir('/home/windowsboy111/Documents/drive/coding/node.js/Merlin/');
const TOKEN = "NjkwODM5MDk5NjQ4NjM4OTc3.Xry74g.d4EtDQuncVrvWRrEB_Apjjgk8-I";
const prefix = "$";
// <= runtime: author machine extra settings
// => init: import / require libraries
const Discord = require('discord.js');
const bot = new Discord.Client();
const webpage = require('./webServer.js');
// const prefix = process.env.prefix
// const TOKEN = process.env.TOKEN
const { Users, CurrencyShop } = require('./dbObjects');
const { Op } = require('sequelize');
const currency = new Discord.Collection();
// => commands: import
const fs = require('fs');
const cooldowns = new Discord.Collection();
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	bot.commands.set(command.name, command);
}
// <= commands: import
lastmsg = null;
console.log('Finished loading all libraries and commands.');
// => karma: helper methods
Reflect.defineProperty(currency, 'add', {
	value: async function add(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});
// <= karma: helper methods
console.log('Loaded karma functions.');
// => discord.js: define actions
bot.on('ready', async () => {
    console.log('awaiting getting karma data tables...');
    const storedBalances = await Users.findAll();
    console.log('loading / setting $$$...');
    storedBalances.forEach(b => currency.set(b.user_id, b));
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', message => {
    if(message.author.bot) return;
    if (message.channel.id == "716137076789346314" || message.channel.id == "720119123845054544"){
        var msg;
        if (message.content.startsWith('```js')){
            msg = message.content.substr(5).slice(0,-3);
        } else {
            msg = message.content;
        }
        try {
            var F=new Function (msg);
            return message.channel.send(F() + "\n> ");
        } catch (e) {
            return message.channel.send(String(e));
        }
    }
    currency.add(message.author.id, 1);
    
    if (message.content.toLowerCase() === '$balance' || message.content.toLowerCase() === '$bal') {
        const target = message.mentions.users.first() || message.author;
        return message.channel.send(`${target.tag} has ${currency.getBalance(target.id)}💰`);
    } else if (message.content.toLowerCase() === '$inventory' || message.content.toLowerCase() === '$inv') {
        const target = message.mentions.users.first() || message.author;
        const user = Users.findOne({ where: { user_id: target.id } });
        const items = user.getItems();
        if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
        return message.channel.send(`${target.tag} currently has ${items.map(t => `${t.amount} ${t.item.name}`).join(', ')}`);
    } else if (message.content.toLowerCase() === '$transfer' || message.content.toLowerCase() === '$tf' || message.content.toLowerCase() === '$trans') {
        const currentAmount = currency.getBalance(message.author.id);
        const transferAmount = commandArgs.split(/ +/).find(arg => !/<@!?\d+>/.test(arg));
        const transferTarget = message.mentions.users.first();

        if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount`);
        if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author} you don't have that much.`);
        if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}`);

        currency.add(message.author.id, -transferAmount);
        currency.add(transferTarget.id, transferAmount);

        return message.channel.send(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${currency.getBalance(message.author.id)}💰`);
    } else if (message.content.toLowerCase().startsWith('$buy')) {
        let commandArgs = message.content.split(' ');
        if (commandArgs.length == 1) return message.channel.send(`You didn't provide any arguments, ${message.author}!\nThe proper usage would be: \`${prefix}buy <item>\``);
        commandArgs.shift();
        CurrencyShop.findOne({ where: { name: { [Op.like]: commandArgs } } }).then(item => {
            if (!item) return message.channel.send('That item doesn\'t exist.');
            if (item.cost > currency.getBalance(message.author.id)) {
                return message.channel.send(`You don't have enough karma, ${message.author}`);
            }
    
            Users.findOne({ where: { user_id: message.author.id } }).then(user => {
                currency.add(message.author.id, -item.cost);
                user.addItem(item);
            });
    
            return message.channel.send(`You've bought a ${item.name}`);
        });
        return;
    } else if (message.content.toLowerCase() === '$shop') {
		CurrencyShop.findAll().then(items => {
            return message.channel.send(items.map(i => `${i.name}: ${i.cost}💰`).join('\n'), { code: true });
        });
        return;
    } else if (message.content.toLowerCase() === '$leaderboard' || message.content.toLowerCase() === '$lb') {
        return message.channel.send(
            currency.sort((a, b) => b.balance - a.balance)
                .filter(user => client.users.cache.has(user.user_id))
                .first(10)
                .map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.balance}💰`)
                .join('\n'),
            { code: true }
        );
    }
    if (message.content.startsWith(prefix)){
        const args = message.content.slice(prefix.length).split(/ +/);
        if (!args) {
            console.log('cannot process command.');
            return message.channel.send('Failed to process the command!')
        }
        const commandName = args.shift().toLowerCase();
        const command = bot.commands.get(commandName)
            || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return message.reply(`command \`${commandName}\` not found!\nTry \`/${message.content.slice(prefix.length)}\`.`);
        try{
            if (command.guildOnly && message.channel.type !== 'text') {
                return message.reply('I can\'t execute that command inside DMs!');
            }            
            if (command.args && !args.length) {
                let reply = `You didn't provide any arguments, ${message.author}!`;
                if (command.usage) {
                    reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
                }
                return message.channel.send(reply);
            }
        } catch {
            console.log('Command not found????');
            return message.channel.send('Command not found. try prefix `/`,`!` or `;`.');
        }
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 1) * 1000;
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        try {
	        command.execute(message, args);
        } catch (error) {
	        console.error(error);
            message.reply('there was an error trying to execute that command!');
        return;
        }
    }else{
        if (message.content.toLowerCase() === "what?"){
            message.react('687109358248525853');
            return;
        }
        if (message.content.toLowerCase() === 'wat?'){
            message.channel.send('Say what?');
            return;
        }


        if (message.content.toLowerCase() == 'justin') {
            message.channel.send('Justin has no dick.');
            return;
        }
        if (message.content.toLowerCase() == "sirius-") {
            var ans = ['-smart','-stupid'];
            message.channel.send(ans[Math.floor(Math.random()*ans.length)])
        }
        // if (message.content.toLowerCase() == "listen to music") {
        //     let channel = message.guild.channels.get("683838655755976704");  
        //     channel.createInvite({unique: true}).then(
        //         invite => {  
        //             message.reply("Hey! I've created you an invite: https://discord.gg/" + invite.code)
        //         }
        //     );
        //     return;
        // }
        if(message.author.bot) return;
        if (lastmsg == null){
            lastmsg=[message.content.toLowerCase(),message.author,1,false]
        } else if (lastmsg[2] == 4 && message.content.toLowerCase() == lastmsg[0] && message.author.equals(lastmsg[1]) && lastmsg[3]){
            lastmsg[2]+=1
            message.delete();
            message.channel.send(`/warn <@${message.author.id}>`)
        } else if (lastmsg[0] == message.content.toLowerCase() && lastmsg[1] == message.author) {
            lastmsg[2]+=1;
            if (lastmsg[2] == 4){
                lastmsg[3]=true
            }
        } else {
            lastmsg=[message.content.toLowerCase(),message.author,1,false]
        }
    }
});
// <= discord.js: define actions

console.log('Logging in...');
bot.login(TOKEN);