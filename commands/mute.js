module.exports = {
	name: 'mute',
	description: 'mute a member',
    args: true,
    guildOnly: true,
    usage: "<member mention> <time>",
	execute(message, args) {
        var waitFor = 0;
        var time = args[1];
        if (time.endswith('s')) {
            waitFor = time.substr(time.length - 1) * 1000;
        } else if (time.endswith('m')) {
            waitFor = time.substr(time.length - 1) * 1000 * 60;
        } else if (time.endswith('h')) {
            waitFor = time.substr(time.length - 1) * 1000 * 60 * 60;
        } else if (time.endswith('d')) {
            waitFor = time.substr(time.length - 1) * 1000 * 60 * 60 * 24;
        } else if (time.endswith('w')) {
            waitFor = time.substr(time.length - 1) * 1000 * 60 * 60 * 24 * 7;
        }
        // Easy way to get member object though mentions.
        var member = message.mentions.members.first();
        // mute the guy
        var role = member.guild.roles.cache.find(role => role.name === "Muted");
        member.roles.add(role);
        setTimeout( () => {
            member.roles.remove(role);
        }, waitFor);
    }
};
