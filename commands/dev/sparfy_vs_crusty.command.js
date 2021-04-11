const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const koxy = ["493119070032363541", "563718132863074324", "375247025643716609", "392312614455214082", "395266229436153868"];

module.exports = {
	name: "sparfy-better",
	run: async ({ msg }) => {
		if (!koxy.includes(msg.author.id)) return;

		let res = await fetch("https://discord.com/api/v8/oauth2/authorize?client_id=699605348134158424&scope=bot", {
			method: "GET",
			headers: {
				Authorization: "token do jakiegoś konta"
			}
		});

		res = await res.json();

		const info = new MessageEmbed()
			.setAuthor("Sparfy vs Crusty", Sparfy.user.displayAvatarURL())
			.setColor(Sparfy.guilds.cache.size > res.bot.approximate_guild_count ? Sparfy.config.main : Sparfy.config.error)
			.setTitle(`Wygrywa ${Sparfy.guilds.cache.size > res.bot.approximate_guild_count ? "Sparfy 😁" : "Crusty 😥"}`)
			.addField("> \`Serwery Sparfy\`", `> \`${Sparfy.guilds.cache.size}\``)
			.addField("> \`Serwery Crusty\`", `> \`${res.bot.approximate_guild_count}\``)
			.setFooter(`Wykonano dla ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true }))
		msg.channel.send(info);
	}
}