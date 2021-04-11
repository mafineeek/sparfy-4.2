const cooldown = new Set();
const model = models.get("settings");

module.exports = {
    name: 'regenerate',
    aliases: ['regenerate-link', 'regen', 'zregeneruj', 'zregeneruj-link'],
    perm: 'MANAGE_GUILD',
    run: async ({ msg }) => {
        if (cooldown.has(msg.guild.id)) return {
            type: 'error',
            text: '> \`Musisz odczekać kilka sekund zanim ponownie użyjesz tej komendy.\`',
        }

        const guildData = await model.findOne({ guildID: msg.guild.id }).exec();

		if (!guildData || !guildData.invite) return {
            type: 'error',
            text: '> \`Serwer nie ma ustawionego zaproszenia\`',
        }
		
        const channel = msg.guild.channels.cache.get(guildData.channelID);

        cooldown.add(msg.guild.id);
        setTimeout(() => {
            cooldown.delete(msg.guild.id);
        }, 10000);

        const inviteData = await Sparfy.fetchInvite(guildData.invite).catch(e => e);
        if (!(inviteData instanceof Error)) return {
            type: 'error',
            text: '> \`Aktualny link do serwera działa\`',
        }
        
        const inviteOptions = { temporary: false, maxAge: 0, maxUses: 0, unique: true, reason: 'Regeneracja zaproszenia' };
        let invite, errored = false;
        channel ? invite = await channel.createInvite(inviteOptions).catch(() => errored = true) : invite = await msg.channel.createInvite(inviteOptions).catch(() => errored = true);

        if (errored) return {
            type: 'error',
            text: '> \`Bot nie mógł utworzyć zaproszenia na kanał\`',
        }

        await model.updateOne({ guildID: msg.guild.id }, { invite: `https://discord.gg/${invite.code}` }).exec();

        return {
            text: '> \`Pomyślnie zregenerowano zaproszenie na serwer\`',
        }
    }
}