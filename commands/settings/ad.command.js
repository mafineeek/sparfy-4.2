const blacklist = ["marketingobt.tk", "nadsc.pl", "hasfy.pl", "crusty.pl", "discord.gg", "discord.com/invite", "discordapp.com/invite", "invite.ovh", "invite.gg"];
const { MessageEmbed } = require("discord.js");
const settings = models.get("settings");
const adChecking = models.get("adChecking");
const ads = models.get("ads");

module.exports = {
	name: "reklama",
	aliases: ["ad", "rek"],
	perm: "MANAGE_GUILD",
	run: async ({ msg, args }) => {

		const data = await settings.findOne({ guildID: msg.guild.id }).exec();

		if (!data || !data.channelID) return {
			type: "error",
			text: "> \`Najpierw ustaw kanał reklam!\`"
		}

		const channel = msg.guild.channels.cache.get(data.channelID);

		if (!channel || !msg.guild.channels.cache.has(channel.id) || channel.type !== "text") return {
			type: "error",
			text: "> \`Najpierw ustaw kanał reklam\`"
		}

		let permsBlock = false;

		channel.permissionOverwrites.forEach(p => {
			try {
				if (!channel.permissionsFor(p.id).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) permsBlock = true;
			} catch { }
		});

		if (!channel.name.includes("sparfy")) return {
			type: "error",
			text: `> \`Kanał reklam musi dotyczyć bota Sparfy\``
		}

		if (permsBlock) return {
			type: "error",
			text: "> \`Kanał reklam musi być widoczny dla wszystkich!\`"
		}

		const adCheck = await adChecking.findOne({ guildID: msg.guild.id }).exec();

		if (adCheck) return {
			type: "error",
			text: "> \`Reklama tego serwera oczekuje na weryfikacje!\`"
		}

		if (!args[0]) return {
			type: "error",
			text: "> \`Podaj treść reklamy!\`"
		}

		if (args.length < 10) return {
			type: "error",
			text: "> \`Reklama musi mieć minimalnie 10 słów!\`"
		}

		const content = args.join(" ");

		if (content.length > 1000) return {
			type: "error",
			text: "> \`Reklama może mieć maksymalnie 1000 znaków!\`"
		}

		if (blacklist.some(x => content.includes(x))) return {
			type: "error",
			text: "> \`Reklama nie może zwierać zaproszeń!\`"
		}

		const ad = await ads.findOne({ guildID: msg.guild.id }).exec();

		const verifyEmbed = new MessageEmbed()
			.setAuthor("Nowa reklama do sprawdzenia!", Sparfy.user.displayAvatarURL())
			.setColor(Sparfy.config.main)
			.addField(`**\`Serwer\`**`, `> \`${msg.guild.name} ( ${msg.guild.id} )\``)
			.addField("**\`Osoba\`**", `> \`${msg.author.tag} ( ${msg.author.id} )\``)
			.addField("**\`Nazwa kanału reklam\`**", `> \`${channel.name} ( ${channel.id} )\``)
			.addField("**\`Pseudonim bota na serwerze\`**", `> \`${msg.guild.me.nickname ? msg.guild.me.nickname : "Brak"}\``)
			.addField("**\`Reklama w kolejce\`**", `> \`${ad ? `Serwer posiada reklamę pod numerem ${ad.number}` : "Serwer nie posiada reklamy"}\``)
			.addField("**\`Zaproszenie\`**", `> [\`${data.invite}\`](${data.invite})`)
			.addField("**\`Treść reklamy\`**", `${content}`)
		const m = await Sparfy.guilds.cache.get(Sparfy.config.support.id).channels.cache.get(Sparfy.config.adChecking).send(verifyEmbed);
		m.react("2942_Check:798183133810917406");
		m.react("744543904870694952:768167999588007977");
		m.react("744543904501858315:768167999693651988");
		await adChecking.insertMany([{ guildID: msg.guild.id, content, messageID: m.id, userID: msg.author.id, embed: JSON.stringify(verifyEmbed.toJSON()), timestamp: Date.now() }]);
		return {
			text: "> \`Reklama została wysłana do weryfikacji!\`"
		}
	}
}