const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'crusty',
	run: async ({ msg }) => {

		const embed = new MessageEmbed()
			.setAuthor('sTaTuS sZaRtUf KrAsTi', Sparfy.user.displayAvatarURL())
			.setColor(Sparfy.config.main)
			.setDescription()
			.setFooter(`Wykonano dla ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true }))
			
		const req = await fetch('https://api.sparfy.net/crusty');

		const res = await req.json();

		const text = [
			`> \`Serwery: ${res.guilds}\``,
			`> \`Reklamy: ${res.ads}\``,
			`> \`Serwery permium: ${res.premiumGuilds}\``,
			`> \`Gbany: ${res.gbans}\``,
			`> \`Ilość shardów: ${res.shards.length}\``
		];

		res.shards.forEach(shard => {
			embed.addField(`> \`Shard ${shard.shardID}\``, `> \`Status: ${shard.status}\`\n> \`Ping: ${shard.ping}ms\`\n> \`Uptime: ${shard.uptime.hours}h ${shard.uptime.minutes}m\``)
		});

		msg.channel.send(embed.setDescription(text.join('\n')));
	}
}