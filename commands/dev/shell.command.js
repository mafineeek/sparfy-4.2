const { MessageEmbed } = require('discord.js');
const { exec } = require('child_process');

module.exports = {
	name: 'shell',
	aliases: ['sh', 'cmd'],
	run: async ({ msg, args }) => {
		if (!Sparfy.config.owners.includes(msg.author.id)) return;

		const cmd = args.join(' ');
		if (cmd === '') return {
			type: "error",
			text: "> \`Musisz podać komendę do wykonania\`"
		}
		const embed = new MessageEmbed()
			.setAuthor('Shell', Sparfy.emoji.cmd.url)
			.setColor(Sparfy.config.main);

		exec(cmd, async (error, data, getter) => {
			if (error) {
				if (error.length > 1012) error = error.substring(0, 1012) + '...';
				embed.setDescription(`\`\`\`\n${error.message}\`\`\``).setColor(Sparfy.config.error);
				return msg.channel.send(embed);
			}
			if (getter) {
				if (data.length > 1012) data = data.substring(0, 1012) + '...';
				embed.setDescription(`\`\`\`\n${data}\`\`\``);
				return msg.channel.send(embed);
			}
			if (data) {
				if (data.length > 1012) data = data.substring(0, 1012) + '...';
				embed.setDescription(`\`\`\`\n${data}\`\`\``);
				return msg.channel.send(embed);
			}
		});
	},
};
