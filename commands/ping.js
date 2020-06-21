const fs = require('fs');
async function sendMsg(responseTime,sendPing,editPing,delPing,message){
    // You can display as
    message.channel.send(`**Response Time:** \`${responseTime}ms\`\n**Send Time:** \`${sendPing}ms\`\n**Edit Time:** \`${editPing}ms\`\n**Delete Time:** \`${delPing}ms\``)
    fs.writeFile('pages/utils/pingjson.js',`var pingData = {"responseTime": ${responseTime},"sendTime": ${sendPing},"editTime": ${editPing}, "delPing": ${delPing}, "time": ${message.createdTimestamp}}`,err => {
        if (err) {
            console.error(err.stack);
            message.channel.send('Well, an error occurred while trying to log the result into a file. Stack:\n' + err.stack);
        }
    });
}
module.exports = {
	name: 'ping',
	description: 'Ping pong!',
	cooldown: 5,
	execute(message, args) {
        var responseTime = Date.now() - message.createdTimestamp;
        var sendPing,editPing,delPing;
        message.channel.send('loading /').then(msg => {
            sendPing = Date.now() - msg.createdTimestamp;
            t = Date.now();
            msg.edit('loading |');
            editPing = Date.now() - t;
            msg.edit('loading \\');
            t = Date.now();
            msg.delete();
            delPing = Date.now() - t;
            sendMsg(responseTime,sendPing,editPing,delPing,message);
        });
	},
};