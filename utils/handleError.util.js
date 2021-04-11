const { MessageEmbed } = require("discord.js");
const { error } = require("../webhooks.json");
const fetch = require("node-fetch");

exports.handleError = (err, guild, author, channel, msg, Sparfy) => {


	const embed = new MessageEmbed()
		.setAuthor("ERROR!!!!!!", Sparfy.user.displayAvatarURL())
		.setColor(Sparfy.config.error)
		.addField("> \`Error title\`", `> \`${err}\``)
		.addField("> \`Error stack\`", `\`\`\`yaml\n${err.stack.toString().slice(0, 1000)}\`\`\``)
		.addField("> \`Guild\`", `> \`${guild.name} (${guild.id})\``)
		.addField("> \`Author\`", `> \`${author.tag} (${author.id})\``)
		.addField("> \`Channel\`", `> \`${channel.name} (${channel.id})\``)
		.addField("> \`Message\`", `> [\`${msg.id}\`](https://discord.com/channels/${guild.id}/${channel.id}/${msg.id})`)
		.setFooter(`${Sparfy.user.username.replace(".pl", ".net")} error reporting system`, Sparfy.user.displayAvatarURL())
		.toJSON()

	fetch(error, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			embeds: [embed]
		})
	});
}