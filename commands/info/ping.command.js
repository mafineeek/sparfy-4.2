const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "ping",
	aliases: ["pong"],
	run: async ({ msg }) => {
		let averagePing = 0;
		
		const text = [];

		const embed = new MessageEmbed()
			.setAuthor(`Ping bota ${Sparfy.user.username}`, Sparfy.user.displayAvatarURL())
			.setColor(Sparfy.config.main)
			.setFooter(`Wykonano dla ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true }));

		Sparfy.ws.shards.forEach(shard => {
			text.push(`> **\`SHARD [${shard.id}]:\`**${shard.id === msg.guild.shardID ? ' \`(Shard tego serwera)\`' : ''} **${(~~(Math.round(shard.ping)))}ms**`);
			averagePing += shard.ping;
		});
		
		averagePing = averagePing / Sparfy.ws.shards.size;

		text.push(`> **\`ŚREDNI PING:\`** **${(~~(Math.round(averagePing)))}ms**`);

		embed.setDescription(text.join('\n'));

		msg.channel.send(embed);
	}
}