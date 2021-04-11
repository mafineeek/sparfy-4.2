const { MessageEmbed } = require("discord.js");
const os = require("os");

module.exports = {
    name: "botinfo",
    aliases: ["bot", "bot-info"],
    desc: "Informacje o bocie",
    run: async ({ msg }) => {
        const guilds = Sparfy.guilds.cache.size;
        let totalUsers = 0;
        Sparfy.guilds.cache.forEach(g => {
            totalUsers += g.memberCount;
        })
        const users = {
            cache: Sparfy.users.cache.size,
            total: totalUsers
        };
        
        let totalSeconds = (Sparfy.uptime / 1000);
        const days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);

        const uptime = `D ${days}, H ${hours}, m ${minutes}, s ${seconds}`

        let owners = "";

        Sparfy.config.owners.forEach(owner => {
            const ownerInfo = Menago.users.cache.get(owner);

            if (!msg.guild.members.cache.get(owner)) {
                owners += `> \`${ownerInfo.tag} (${ownerInfo.id})\`\n`;
            } else {
                owners += `> <@!${owner}>\n`;
            }
        });

        const usedRam = Math.round(process.memoryUsage().heapTotal / 1024 / 1024);
		const totalRam = Math.round(os.totalmem() / 1024 / 1024);

        let emoji = "";

        if (Sparfy.ws.ping < 100) {
            emoji = "<:oninternet:772183041228668989>";
        } else if (Sparfy.ws.ping < 200) {
            emoji = "<:dndinternet:772182998996353074>";
        } else {
            emoji = "<:afkinternet:772183015136559114>";
        }


        const waitEmbed = new MessageEmbed()
            .setAuthor("Ładowanie proszę czekać!", Sparfy.user.displayAvatarURL())
            .setColor(Sparfy.config.main)
        const m = await msg.channel.send(waitEmbed);

        waitEmbed
            .setAuthor(`Informacje o ${Sparfy.user.username}`, Sparfy.user.displayAvatarURL())
            .addField("<:znakzapytania:772153279748636753> **\`Statystyki\`**", `> \`Serwery: ${guilds}\`
            > \`Użytkownicy: (${users.cache} cache) (${users.total} wszyscy)\`
            > \`Kanały: ${Sparfy.channels.cache.size}\`
            > \`Kanały tekstowe: ${Sparfy.channels.cache.filter(c => c.type === "text").size}\`
            > \`Kanały głosowe: ${Sparfy.channels.cache.filter(c => c.type === "voice").size}\`
            > \`Kanały ogłoszeń: ${Sparfy.channels.cache.filter(c => c.type === "news").size}\`
            > \`Kanały sklepowe: ${Sparfy.channels.cache.filter(c => c.type === "store").size}\``)
            .addField(`${emoji} **\`Zasoby\`**`, `> \`Ram: ${usedRam}/${totalRam}mb\`
            > \`Model procesora: ${os.cpus()[0].model}\`
            > \`Wersja NodeJS: ${process.version}\`
            > \`Wersja Discord.js: ${require("discord.js").version}\`
            > \`Uptime: ${uptime}\``)
            .addField("🏓 **\`Połączenie\`**", `> \`Api: ${Math.floor(Math.round(Sparfy.ws.ping))}ms\`
            > \`Sparfy: ${Math.floor(Math.round(m.createdTimestamp - msg.createdTimestamp))}ms\``)
            .addField("👑 **\`Właściciele\`**", owners)
            .setFooter(`Wykonano dla: ${msg.author.tag}`, msg.author.displayAvatarURL({dynamic: true}));
        m.edit(waitEmbed);
    }
}