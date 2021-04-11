/* eslint-disable no-eval */
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'eval',
	aliases: ['js', "dżawaskript", "jebać_pseudoli"],
	run: async ({ msg, args }) => {
		if (!Sparfy.config.owners.includes(msg.author.id)) return {
			type: "error",
			text: "> \`Nie jesteś właścicielem bota\`"
		}

		let toEval = args.join(' ');

		try {
			let evaled = await eval(toEval);

			if (typeof evaled !== 'undefined' && evaled.toString().includes(Sparfy.token)) {
				const embed = new MessageEmbed()
					.setAuthor('Wykonano pomyślnie!', Sparfy.emoji.yes.url)
					.addField('Kod', '```js\n' + (toEval || 'null') + '\n```')
					.addField('Wynik', '```wypierdalaj```')
					.addField('Typ', '```token bota```')
					.setColor(Sparfy.config.main);
				return msg.channel.send(embed);
			}

			const type = typeof evaled;
			if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
			if (toEval.length > 1012) toEval = toEval.substring(0, 1012) + '...';
			if (evaled.length > 1012) evaled = evaled.substring(0, 1012) + '...';

			const embed = new MessageEmbed()
				.setAuthor('Wykonano pomyślnie!', Sparfy.emoji.yes.url)
				.addField('Kod', '```js\n' + (toEval || 'null') + '\n```')
				.addField('Wynik', '```js\n' + (evaled) + '```')
				.addField('Typ', '```js\n' + (type) + '```')
				.setColor(Sparfy.config.main);
			return msg.channel.send(embed);
		} catch (error) {
			const errorEmbed = new MessageEmbed()
				.setAuthor('Wystąpił błąd!', Sparfy.emoji.warning.url)
				.setDescription('Błąd' + ':\n```js\n' + (error) + '```')
				.setColor(Sparfy.config.error);
			return msg.channel.send(errorEmbed);
		}
	},
};
