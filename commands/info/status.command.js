const { MessageEmbed } = require('discord.js');
const settings = models.get("settings");
const ads = models.get("ads");
const links = models.get("links");
const adChecking = models.get("adChecking");

module.exports = {
    name: 'status',
    aliases: ['ad-status', 'adstatus'],
    run: async ({ msg }) => {
        const guildData = await settings.findOne({ guildID: msg.guild.id }).exec();
        const channel = guildData?.channelID ? `${Sparfy.emoji.yes.emoji} <#${guildData?.channelID}>` : `${Sparfy.emoji.no.emoji} \`Nie ustawiony\``;

		/**
		 * There are 4 status codes
		 * 0 - Ad is verified and is in the queue
		 * 1 - Ad isn't set
		 * 2 - Ad is awaiting review
		 * 3 - Ad is set but there is a new ad awaiting review
		 */
        let statusCode = null;
        let statusDesc = '';

        let ad = null;

        const adsCheckGuildData = await adChecking.findOne({ guildID: msg.guild.id }).exec();
        const adsGuildData = await ads.findOne({ guildID: msg.guild.id }).exec();

        if (!adsCheckGuildData && adsGuildData)
            statusCode = 0;
        else if (!adsCheckGuildData && !adsGuildData)
            statusCode = 1;
        else if (adsCheckGuildData && !adsGuildData)
            statusCode = 2;
        else if (adsCheckGuildData && adsGuildData)
            statusCode = 3;

        switch (statusCode) {
            case 0: {
                statusDesc = `${Sparfy.emoji.yes.emoji} **\`Reklama jest zweryfikowana!\`**\n:hash: **Numer w kolejce**: \`${adsGuildData.number}\`\n:mega: Ta reklama została wysłana **\`${adsGuildData.sent}\` razy**`;
                ad = adsGuildData.content;
                break;
            }
            case 1: {
                statusDesc = `${Sparfy.emoji.no.emoji} \`Reklama nie jest ustawiona\``;
                ad = null;
                break;
            }
            case 2: {
                statusDesc = `${Sparfy.emoji.discord_loading.emoji} \`Reklama oczekuje na weryfikację\``;
                ad = adsCheckGuildData.content;
                break;
            }
            case 3: {
                statusDesc = `${Sparfy.emoji.yes.emoji} **\`Reklama jest zweryfikowana!\`**\n:hash: **Numer w kolejce**: \`${adsGuildData.number}\`\n:mega: Ta reklama została wysłana **\`${adsGuildData.sent}\` razy**\n\n${Sparfy.emoji.discord_loading.emoji} \`Nowa reklama tego serwera czeka na weryfikację\``;
                ad = adsGuildData.content;
                break;
            }
            default: {
                statusDesc = `${Sparfy.emoji.warning.emoji} \`Wystąpił nieznany błąd\``;
                break;
            }
        }

        const linkData = await links.findOne({ guildID: msg.guild.id }).exec();

        const statusEmbed = new MessageEmbed()
            .setAuthor(`Status konfiguracji serwera ${msg.guild.name}`, msg.guild.iconURL({ dynamic: true }))
            .addField("Custom URL", `${linkData ? `${Sparfy.emoji.yes.emoji} [**\`Link jest ustawiony!\`**](${Sparfy.config.url}/${encodeURIComponent(linkData.link)})` : `${Sparfy.emoji.no.emoji} **\`Link nie jest ustawiony!\`**`}`)
            .addField('Kanał reklam', channel, true)
            .addField('Status reklamy', statusDesc)
            .addField('Treść obecnej reklamy', ad ? ad : `${Sparfy.emoji.no.emoji} \`Nie ustawiona\``);
        if (statusCode === 3)
            statusEmbed.addField('Treść nowej reklamy', adsCheckGuildData.content);
        statusEmbed
            .setColor(Sparfy.config.main);
        return msg.channel.send(statusEmbed);
    }
};
