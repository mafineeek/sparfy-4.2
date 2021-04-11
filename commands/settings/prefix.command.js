const model = models.get("guild");

module.exports = {
	name: 'prefix',
	aliases: ['prefiks'],
	perm: 'MANAGE_GUILD',
	run: async ({ msg, args }) => {
		if (!args[0]) return {
			type: 'error',
			text: '> `Podaj prefix`'
		}

		if (args[0].length > 20) return {
			type: 'error',
			text: '> `Prefix może mieć maksymalnie 20 znaków`'
		}

		if (msg.guild.prefix === args[0]);
		else {
			await model.updateOne({ guildID: msg.guild.id }, { prefix: args[0] }).exec();
		}

		msg.guild.prefix = args[0];

		return {
			text: '> `Pomyślnie zmieniono prefix bota!`'
		}
	},
};
