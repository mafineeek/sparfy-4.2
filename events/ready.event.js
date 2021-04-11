const queueData = require("../adsQueue.json");
const { writeFileSync } = require("fs");
const ads = models.get("ads");
const settings = models.get("settings");
const number = models.get("queue");


module.exports = async (bot) => {
	bot.log("ready", `Logged in as ${bot.user.tag}`);
	bot.config.owners.forEach(async owner => {
		await bot.users.fetch(owner);
	});
	await Sparfy.user.setPresence({ activity: { name: `⭐ 4.2.2 | @${Sparfy.user.username} | ${Sparfy.config.prefix}pomoc` }, status: "dnd" });

	const queue = async () => {
		let numData = await number.find({});

		numData = numData[0];

		if (!numData) {
			await number.insertMany([{ number: 1 }]);
			numData = { number: 1 }
		}

		numData = numData.number;

		const ad = await ads.findOne({ number: numData }).exec();

		if (!ad) {
			const x = await number.updateOne({ number: numData }, { number: 1 }).exec();
			return queue();
		}

		const guild = Sparfy.guilds.cache.get(ad.guildID);

		if (!guild) {
			await number.updateOne({ number: numData }, { number: numData + 1 }).exec();
			return queue();
		}

		const guildData = await settings.findOne({ guildID: guild.id }).exec();

		if (!guildData || !guildData.channelID) {
			await number.updateOne({ number: numData }, { number: numData + 1 }).exec();
			return queue();
		}

		const channel = Sparfy.channels.cache.get(guildData.channelID);

		if (!channel || channel.nsfw || channel.type !== "text") {
			await number.updateOne({ number: numData }, { number: numData + 1 }).exec();
			return queue();
		}

		let permBlock;

		for (const perm of channel.permissionOverwrites) {
			const p = channel.permissionsFor(perm.id);

			if (!p);
			else if (!p.has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
				permBlock = true;
				break;
			}
		}

		if (permBlock) {
			await number.updateOne({ number: numData }, { number: numData + 1 }).exec();
			return queue();
		}

		const adContent = [
			`***\`🌐 NR:\`*** **${numData}** ***\`📂 ID:\`*** **${guild.id}**`,
			`***\`🔗 LINK:\`*** ${guildData.invite}`,
			`${ad.content}`
		].join("\n");
		let total = 0;

		Sparfy.guilds.cache.forEach(async g => {
			const data = await settings.findOne({ guildID: g.id }).exec();

			if (!data || !data.channelID) return;

			const channel = g.channels.cache.get(data.channelID);

			if (!channel || channel.type !== "text") return;

			if (!channel.permissionsFor(g.me).has("SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS")) return;

			const sent = await channel.send(adContent).catch(e => e);
			if (sent instanceof Error) return;
			total++;
		});

		await number.updateOne({ number: numData }, { number: numData + 1 }).exec();
		await ads.updateOne({ guildID: guild.id }, { sent: isNaN(ad.sent + total) ? 0 : Number(ad.sent + total), queue: ad.queue + 1 }).exec();

		setTimeout(() => {
			queue();
		}, queueData.minutes * 60 * 1000);
	}

	queue();
}