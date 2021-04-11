const { MessageEmbed } = require("discord.js");
const { gbanCheck } = require("../utils/gbanCheck.util");
const { handleError } = require("../utils/handleError.util");
const model = models.get("guild");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const dayjs = require("dayjs");
dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = async (bot, msg) => {
	if (!msg.guild) return;
	if (msg.author.bot) return;

	if (!msg.guild.prefix) {
		const data = await model.findOne({ guildID: msg.guild.id }).exec();
		if (!data) {
			msg.guild.prefix = Sparfy.config.prefix;
			await model.insertMany([{ guildID: msg.guild.id, prefix: Sparfy.config.prefix }]);
		} else {
			msg.guild.prefix = data.prefix;
		}
	}

	if (msg.content === `<@!${Sparfy.user.id}>` || msg.content === `<@${Sparfy.user.id}>`) {
		const mentionEmbed = new MessageEmbed()
			.setAuthor(`Witaj ${msg.author.username}`, msg.author.displayAvatarURL({ dynamic: true }))
			.setColor(Sparfy.config.main)
			.setDescription(`> \`Mój prefix na tym serwerze to ${msg.guild.prefix}\`
> \`Moją listę komend znajdziesz jeśli wpiszesz ${msg.guild.prefix}pomoc\``)
		return msg.channel.send(mentionEmbed);
	}

	let msgPrefix = msg.guild.prefix;

	if (!msg.content.startsWith(msgPrefix)) msgPrefix = `<@${Sparfy.user.id}>`;
	if (!msg.content.startsWith(msgPrefix)) msgPrefix = `<@!${Sparfy.user.id}>`;
	if (!msg.content.startsWith(msgPrefix)) return;

	const args = msg.content.slice(msgPrefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();

	if (!cmd.length) return;

	let command = Sparfy.commands.get(cmd);
	if (!command) command = Sparfy.commands.get(Sparfy.aliases.get(cmd));

	if (!command) return;

	if (msg.author.id === "699601151674286181") {
		const orderHazukiego = new MessageEmbed()
			.setAuthor("Gratulacje!", Sparfy.user.displayAvatarURL())
			.setColor(Sparfy.config.main)
			.setDescription("> \`Dostałeś order podbijacza statystyk Sparfy.net!\`\n> \`Nie możesz używać przez to bota ponieważ nie jest godny twojej głupoty!\`")
			.setFooter(`Wykonano dla ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true }))
		return msg.channel.send(orderHazukiego);
	}

	if (msg.author.id === "693424205835927573") {
		const orderTymona = new MessageEmbed()
			.setAuthor("Gratulacje!", Sparfy.user.displayAvatarURL())
			.setColor(Sparfy.config.main)
			.setDescription("> \`Dostałeś order Tymona!\`\n> \`Nie możesz używać przez to bota ponieważ nie jest godny twojej głupoty!\`")
			.setFooter(`Wykonano dla ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true }))
		return msg.channel.send(orderTymona);
	}

	const gban = gbanCheck(msg.author.id);

	if (gban) {
		const gbanErr = new MessageEmbed()
			.setAuthor("Global Ban!", Sparfy.user.displayAvatarURL())
			.setColor(Sparfy.config.error)
			.addField("**\`Powód\`**", `> \`${gban.reason}\``)
			.addField("**\`Data nadania\`**", `> \`${dayjs(gban.timestamp).tz("Europe/Warsaw").format("DD:MM:YYYY HH:mm")}\``)
			.addField("**\`Kto nadał\`**", `> \`${gban.who}\``)
			.setFooter(`Wykonano dla ${msg.author.tag}`)
		return msg.channel.send(gbanErr);
	}
	if (command.perm && !msg.member.hasPermission(command.perm) && !Sparfy.config.owners.includes(msg.author.id)) {
		const errPerms = new MessageEmbed()
			.setAuthor("Odmowa dostępu!", Sparfy.user.displayAvatarURL())
			.setDescription(`> \`Nie posiadasz permisji ${require("../permissions.json")[command.perm]}\``)
			.setColor(Sparfy.config.error)
			.setFooter(`Wykonano dla ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true }))
		return msg.channel.send(errPerms);
	}

	const data = {
		msg,
		cmd,
		args
	}

	const res = await command.run(data).catch(e => e);

	if (res instanceof Error) {
		console.log(res);
		const embed = new MessageEmbed()
			.setAuthor("Błąd bota!", Sparfy.user.displayAvatarURL())
			.setDescription(`> \`Podczas wykonywania tego polecenia wystąpił błąd który zgłosiłem do programistów\``)
			.setColor(Sparfy.config.error)
			.setFooter(`Wykonano dla ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true }))
		msg.channel.send(embed);
		return await handleError(res, msg.guild, msg.author, msg.channel, msg, Sparfy);
	}

	if (!res || !res.text) return;

	const embed = new MessageEmbed()
		.setAuthor(res.type && res.type === "error" ? "Błąd" : "Sukces!", Sparfy.user.displayAvatarURL())
		.setDescription(`${res.text}`)
		.setColor(res.type && res.type === "error" ? Sparfy.config.error : Sparfy.config.main)
		.setFooter(`Wykonano dla ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true }))
	msg.channel.send(embed);

}
