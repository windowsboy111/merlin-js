module.exports = {
	name: 'dm',
	description: 'dm a guy with id',
	cooldown: 5,
    args: true,
    usage: "<user id> <message>",
	execute(message, args) {
        if (args.length < 2){
            message.reply('pls chk usage!');
            return;
        }
        u = message.mentions.members.first();
        args.shift();
        u.send(args.join(" ")).catch(function(e){
            message.reply("Cannot dm that user! Error: " + String(e));
        });
        message.channel.send(`Message has been sent.\nName: ${u.displayName}`);
    }
}