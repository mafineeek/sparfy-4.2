const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'dbstats',
	aliases: ['dbinfo'],
	run: async ({ msg }) => {
		if (!Sparfy.config.owners.includes(msg.author.id)) return;

		const embed = new MessageEmbed()
			.setAuthor("Statystyki bazy danych", Sparfy.user.displayAvatarURL())
			.setColor(Sparfy.config.main)
			.addField("> \`Ilość kolekcji\`", `> \`${models.size}\``)

		await new Promise(r => {
			let i = 0;
			models.forEach(async (model) => {
				const info = await model.collection.stats();
				embed.addField(`> \`${info.ns.split(".")[1]}\``, `> \`Waga kolekcji: ${Math.floor(Math.round(info.size))}b\`\n> \`Ilość dokumentów: ${info.count}\``)
				if (i === models.size - 1) r();
				i++;
			});
		});
	
		msg.channel.send(embed.setFooter(`Wykonano dla ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true })));
	}
}
