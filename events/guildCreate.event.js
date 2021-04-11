const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = async (bot, guild) => {

    const logs = await guild.fetchAuditLogs({
        limit: 1,
        type: "BOT_ADD"
    }).catch(() => { });

    const user = logs ? logs.entries.first().executor : {tag: "Nie można określić", id: "Nie można określić"}

    const invite = await guild.channels.cache.filter(c => c.type === "text" && c.permissionsFor(guild.me).has("CREATE_INSTANT_INVITE")).random()?.createInvite({maxAge: 0}).catch(() => {});

    const guildCreateEmbed = new MessageEmbed()
        .setAuthor("Nowy serwer!", bot.user.displayAvatarURL())
        .setThumbnail(guild.iconURL({ dynamic: true }) || bot.user.displayAvatarURL())
        .setColor("#a606d6")
        .addField("> \`Serwer\`", `> \`${guild.name} (${guild.id})\``)
        .addField("> \`Kto dodał\`", `> \`${user.tag} (${user.id})\``)
        .addField("> \`Ilość osób\`", `> \`${guild.memberCount}\``)
        .addField("> \`Zaproszenie\`", `> [\`${invite.code ? `https://discord.gg/${invite.code}` : "Nie można określić"}\`](${invite ? `https://discord.gg/${invite.code}` : "Nie można określić"})`)
        .setTimestamp();
    Sparfy.channels.cache.get("804779212019073054").send(guildCreateEmbed);


}
