const { MessageEmbed } = require("discord.js");
const { handleError } = require("../utils/handleError.util");

const temp = new Map();
const ads = models.get("ads");
const adChecking = models.get("adChecking");
const settings = models.get("settings");

/* funkcje */

const approvedTemplate = (user, guild, time, number, bot) => {
	const text = [
		"<:2942_Check:798183133810917406> \`REKLAMA SERWERA ZOSTAŁA:\` **__ZAAKCEPTOWANA__**\n",
		"`🌐STATUS:`",
		"**```css",
		"-ZWERYFIKOWANA```**",
		"`🔗SERWER:`",
		"**```http",
		`${guild.name}\`\`\`**`,
		"`📋SPRAWDZAŁ:`",
		"**```elm",
		`${user.tag}\`\`\`**`,
		"`⏱CZAS OCZEKIWANIA:`",
		"**```css",
		`[${time.hours}]h [${time.minutes}]min\`\`\`**`,
	];

	const embed = new MessageEmbed()
		.setAuthor(`REKLAMA DODANA POD NR. ${number}`, bot.user.displayAvatarURL())
		.setColor("GREEN")
		.setDescription(text.join("\n"))

	return embed;
}

const rejectTemplate = (user, guild, time, reason, bot) => {
	const text = [
		"<:744543904870694952:768167999588007977> `REKLAMA SERWERA ZOSTAŁA:` **__ODRZUCONA__**\n",
		"`🌐STATUS:`",
		"**```diff",
		"-NIEZWERYFIKOWANA```**",
		"`🔗SERWER:`",
		"**```http",
		`${guild.name}\`\`\`**`,
		"`📋SPRAWDZAŁ:`",
		"**```elm",
		`${user.tag}\`\`\`**`,
		"`⏱CZAS OCZEKIWANIA:`",
		"**```css",
		`[${time.hours}]h [${time.minutes}]min\`\`\`**`,
		"`⚠️POWÓD:`",
		"**```http",
		`${reason}\`\`\`**`
	];

	const embed = new MessageEmbed()
		.setAuthor("REKLAMA ODRZUCONA", bot.user.displayAvatarURL())
		.setColor(bot.config.error)
		.setDescription(text.join("\n"))

	return embed;
}

const reject = async (Sparfy, data, msg, embed, time, reason, user, guild, channel) => {
	msg.reactions.removeAll();
	const baseEmbed = new MessageEmbed(embed)
		.setColor(Sparfy.config.error)
		.setFooter(`Reklama odrzucona przez ${user.tag}`, user.displayAvatarURL({ dynamic: true }))
		.addField("> \`Powód odrzucenia\`", `\`\`\`${reason}\`\`\``)
	msg.edit(baseEmbed)

	// Kasowanie reklamy z bazy danych
	await adChecking.deleteOne({ guildID: guild.id }).exec();

	// Generowanie embeda odrzucenia reklamy
	const template = rejectTemplate(user, guild, time, reason, Sparfy)

	// Wysyłanie na kanał statusy reklam
	const err = await msg.guild.channels.cache.get(Sparfy.config.notflicationsChannel)?.send(template).catch(e => e);
	if (err instanceof Error) handleError(err, guild, msg.author, msg.channel, msg, Sparfy);

	// Wysyłanie do użytkownika
	const e = await Sparfy.users.cache.get(data.userID)?.send(template).catch(e => e);
	if (e instanceof Error) handleError(e, guild, msg.author, msg.channel, msg, Sparfy);

	// Wysyłanie na kanał
	const error = await channel?.send(template).catch(e => e);
	if (error instanceof Error) handleError(error, guild, msg.author, msg.channel, msg, Sparfy);
}

const approved = async (Sparfy, data, msg, embed, number, time, user, guild, channel) => {
	msg.reactions.removeAll();
	const baseEmbed = new MessageEmbed(embed)
		.setColor("GREEN")
		.setFooter(`Reklama dodana przez ${user.tag}`, user.displayAvatarURL({ dynamic: true }))
		.addField("> \`Dodana pod\`", `\`\`\`Numer ${number}\`\`\``)
	msg.edit(baseEmbed)

	// Kasowanie reklamy z bazy danych
	await adChecking.deleteOne({ guildID: guild.id }).exec();

	// Generowanie embeda dodania
	const template = approvedTemplate(user, guild, time, number, Sparfy);

	// Wysyłanie na kanał statusy reklam
	const err = await msg.guild.channels.cache.get(Sparfy.config.notflicationsChannel)?.send(template).catch(e => e);
	if (err instanceof Error) handleError(err, guild, msg.author, msg.channel, msg, Sparfy);

	// Wysyłanie do użytkownika
	const e = await Sparfy.users.cache.get(data.userID)?.send(template).catch(e => e);
	if (e instanceof Error) handleError(e, guild, msg.author, msg.channel, msg, Sparfy);

	// Wysyłanie na kanał
	const error = await channel?.send(template).catch(e => e);
	if (error instanceof Error) handleError(error, guild, msg.author, msg.channel, msg, Sparfy);
}

/* funkcje */

module.exports = async (bot, reaction, user) => {
	// Osoba to bot?
	if (user.bot) return;

	// Nie chciało mi się pisać cały czas reaction.message
	const msg = reaction.message;

	// Sprawdzanie ID serwera
	if (!msg.guild || msg.guild.id !== Sparfy.config.support.id) return;

	// Sprawdzanie ID kanału
	if (!msg.channel || msg.channel.id !== Sparfy.config.adChecking) return;

	// Pobieranie informacji o reklamie z bazy danych
	const data = await adChecking.findOne({ messageID: msg.id }).exec();

	// Sprawdzanie czy jest wartość
	if (!data) return;

	// Sprawdzanie czy osoba nie weryfikuje aktualnie reklamy
	if (temp.has(user.id)) return reaction.users.remove(user.id);

	// Sprawdzanie czy ktoś inny nie weryfikuje aktualnie tej reklamy
	if (temp.has(`${msg.id}_m`)) return reaction.users.remove(user.id);

	// Wydobywanie obiektu serwera z cache bota
	const guild = Sparfy.guilds.cache.get(data.guildID);

	// Obliczanie czasu trwania weryfikacji
	let totalSeconds = ((Date.now() - data.timestamp) / 1000);
	totalSeconds %= 86400;
	const hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	const minutes = Math.floor(totalSeconds / 60);

	// Przypisywanie czasu do zmiennej
	const time = {
		hours,
		minutes
	}

	// Parsowanie tekstu na JSON
	const embed = JSON.parse(data.embed);

	// Ustawianie statusu weryfikowania na true
	temp.set(`${msg.id}_m`, true);

	// Jeśli nie ma serwera
	if (!guild) return reject(Sparfy, data, msg, embed, time, "Brak bota na serwerze", Sparfy.user, { name: "Nie można określić", id: data.guildID })

	// Wyszukiwanie configu serwera w bazie danych
	const guildData = await settings.findOne({ guildID: guild.id }).exec();

	if (!guildData) return reject(Sparfy, data, msg, embed, time, "Brak ustawionego kanału reklam", Sparfy.user, guild)

	// Wydobywanie kanału z cache bota
	const channel = Sparfy.channels.cache.get(guildData.channelID);

	/* If'y od kanału nie chce mi się już komentów pisać */
	if (!channel || channel.type !== "text") return reject(Sparfy, data, msg, embed, time, "Brak kanału reklam na serwerze lub kanał nie jest tekstowy", Sparfy.user, guild, channel);

	if (channel.nsfw) return reject(Sparfy, msg, time, "Kanał reklam jest nsfw", Sparfy.user, guild, channel);

	if (channel.permissionOverwrites.some(p => !channel.permissionsFor(p.id)?.has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]))) return reject(Sparfy, data, msg, embed, time, "Kanał reklam jest ukryty", Sparfy.user, guild, channel);

	if (!channel.name.includes("sparfy")) return reject(Sparfy, data, msg, embed, time, "Nazwa kanału reklam nie dotyczy bota Sparfy", Sparfy.user, guild, channel);
	/* Koniec if'ów od kanału */

	if (guild.me.nickname && !guild.me.nickname.toLowerCase().includes("sparfy")) return reject(Sparfy, data, msg, embed, time, "Pseudonim bota nie zawiera słowa Sparfy", Sparfy.user, guild, channel);

	// Switch z id reakcji
	switch (reaction._emoji.id) { /* _emoji bo wpływa na użycie procesora wiem discord.js jest spierdolony */

		// Dodawanie
		case "798183133810917406": {
			const adData = await ads.findOne({ guildID: guild.id }).exec();

			const number = adData ? Number(adData.number) : (await ads.find({})).length + 1;

			if (adData) {
				await ads.updateOne({ number }, { content: data.content }).exec();
			} else {
				await ads.insertMany([{ guildID: guild.id, number, content: data.content, sent: 0, queue: 0 }]);
			}

			await approved(Sparfy, data, msg, embed, number, time, user, guild, channel);
			temp.delete(user.id);
			temp.delete(`${msg.id}_m`);
			break;
		}

		// Odrzucanie
		case "768167999588007977": {
			const filter = m => m.author.id === user.id;

			const message = await msg.channel.send("> \`Podaj powód odrzucenia reklamy\`");

			const collector = msg.channel.createMessageCollector(filter, { time: 40000 });

			let reason;

			collector.on("collect", m => {
				m.delete();
				reason = m.content.slice(0, 150);
				collector.stop();
			});

			collector.on("end", async () => {
				temp.delete(user.id);
				temp.delete(`${msg.id}_m`);

				message.delete();

				if (!reason) return reaction.users.remove(user.id);

				await reject(Sparfy, data, msg, embed, time, reason, user, guild, channel);
			});

			break;
		}

		// Dodawanie pod konkretny numer
		case "768167999693651988": {
			let number;

			const message = await msg.channel.send("> \`Podaj numer pod który ma zostać dodana reklama\`");

			const filter = m => m.author.id === user.id;

			const collector = msg.channel.createMessageCollector(filter, { time: 20000 });

			collector.on("collect", async m => {
				m.delete();
				if (isNaN(m.content)) {
					const mm = await msg.channel.send("> \`Podaj poprawną liczbę!\`");

					return mm.delete({ timeout: 3000 });
				}

				const checkAdData = await ads.findOne({ number: Number(m.content) }).exec();

				if (!checkAdData) {
					const mm = await msg.channel.send("> \`Reklamy o takim numerze nie ma w kolejce!\`");

					return mm.delete({ timeout: 3000 });
				}

				number = Number(m.content);
				collector.stop();
			});

			collector.on("end", async () => {
				temp.delete(user.id);
				temp.delete(`${msg.id}_m`);
				message.delete();

				if (!number) return reaction.users.remove(user.id);

				const checkData = await ads.findOne({ number, guildID: guild.id }).exec();

				if (checkData) {
					await ads.updateOne({ number, guildID: guild.id }, { content: data.content }).exec();
					
					return await approved(Sparfy, data, msg, embed, number, time, user, guild, channel);
				}

				await ads.updateOne({ number }, { content: data.content, sent: 0, guildID: guild.id, queue: 0 }).exec();

				await approved(Sparfy, data, msg, embed, number, time, user, guild, channel);
			});
			break;
		}

		default: return reaction.users.remove(user.id);
	}
}