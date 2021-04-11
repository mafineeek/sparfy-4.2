const model = models.get("settings");

module.exports = {
	name: "kanał",
	aliases: ["kanal", "channel"],
	perm: "MANAGE_GUILD",
	run: async ({ msg }) => {
		let channel = msg.mentions.channels.first() || msg.guild.channels.cache.filter(c => c.name.includes("sparfy_reklamy") || c.name.includes("sparfy-reklamy")).first();

		if (!channel || !msg.guild.channels.cache.has(channel.id) || channel.type !== "text") {
			if (msg.guild.me.hasPermission("MANAGE_CHANNELS")) {
				channel = await msg.guild.channels.create(Sparfy.config.channelName, { type: "text", permissionOverwrites: [{ id: msg.guild.id, deny: ["SEND_MESSAGES"], allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"] }], reason: "Wymagane dla reklam bota Sparfy.net" }).catch((e) => { console.log(e) });
				if (!channel) return {
					type: "error",
					text: "> \`Musisz oznaczyć kanał reklam!\`"
				}
				channel.setPosition(0);
			} else return {
				type: "error",
				text: "> \`Musisz oznaczyć kanał reklam!\`"
			}
		}

		let permsBlock = false;

		channel.permissionOverwrites.forEach(p => {
			try {
				if (!channel.permissionsFor(p.id).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) permsBlock = true;
			} catch { }
		});

		if (!channel.name.includes("sparfy")) return {
			type: "error",
			text: `> \`Kanał musi dotyczyć bota Sparfy!\``
		}

		if (permsBlock) return {
			type: "error",
			text: "> \`Kanał reklam musi być widoczny dla wszystkich!\`"
		}

		const invite = await channel.createInvite({ maxAge: 0 }).catch(() => { });

		if (!invite) return {
			type: "error",
			text: "> \`Bot nie mógł stworzyć zaproszenia na kanał!\`"
		}

		const data = await model.findOne({ guildID: msg.guild.id }).exec();

		if (!data) {
			await model.insertMany([{ guildID: msg.guild.id, channelID: channel.id, invite: `https://discord.gg/${invite.code}` }]);
		} else {
			await model.updateOne({ guildID: msg.guild.id }, { channelID: channel.id, invite: `https://discord.gg/${invite.code}` }).exec();
		}

		return {
			text: `> \`Kanał reklam został ustawiony na #${channel.name}\``
		}
	}
}