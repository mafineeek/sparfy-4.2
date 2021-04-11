const { MessageEmbed } = require('discord.js');
const model = models.get("adChecking");

module.exports = {
	name: 'ads-check-list',
	aliases: ['adschecklist', 'unverified-ads', 'unverifiedads', 'unver-ads', 'unverads'],
	run: async ({ msg }) => {
        if (!await Menago.guilds.cache.get(Sparfy.config.support.id).member(msg.author).roles.cache.has(Sparfy.config.support.verifyRole)) return;

		const list = [];

		const data = await model.find({});

		let i = 0;

		data.forEach(element => {
			if (!list[i]) list[i] = [];

			if (list[i].length >= 20) {
				i++;
			}

			list[i].push(`> [\`Klik\`](https://discord.com/channels/745685581366952056/745687783519158403/${element.messageID})`);
		});

		i = 0;

		if (list.length === 0) return {
			type: "error",
			text: "> \`Aktualnie nie ma żadnej reklamy do weryfikacji!\`"
		}

		const embed = new MessageEmbed()
			.setAuthor("Lista reklam do weryfikacji")
			.setColor(Sparfy.config.main)
			.setDescription(list[i].join("\n"))
			.setFooter(`Wykonano dla ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true }))
		const m = await msg.channel.send(embed);

		await m.react("◀");
		await m.react("▶");

		const filter = (reaction, user) => user.id === msg.author.id;

		const collector = m.createReactionCollector(filter, { time: 30000 });

		collector.on("collect", (reaction, user) => {
			reaction.users.remove(user.id);
			switch(reaction.emoji.name) {
				case "◀": {
					if (!list[i - 1]) return;

					i = i -1;

					embed.setDescription(list[i].join("\n"));
					break;
				}

				case "▶": {
					if (!list[i + 1]) return;

					i = i + 1;

					embed.setDescription(list[i].join("\n"));
					break;
				}
			}
		});

		collector.on("end", () => {
			m.reactions.removeAll();
		});
	},
};
