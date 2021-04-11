const { MessageEmbed } = require("discord.js");

module.exports = async (bot, guild) => {
    await models.get("settings").findOneAndDelete({ guildID: guild.id }).exec();
    await models.get("guild").findOneAndDelete({ guildID: guild.id }).exec();

	if (!guild.ownerID) return;

    const owner = await Sparfy.users.fetch(guild.ownerID).catch(e => e);

	if (owner instanceof Error) return;

    const guildDeleteEmbed = new MessageEmbed()
        .setAuthor("Wyrzucono bota!", Sparfy.user.displayAvatarURL())
        .setColor("#ff0000")
        .addField("> \`Serwer\`", `> \`${guild.name} (${guild.id})\``)
        .addField("> \`Właściciel\`", `> \`${Sparfy.users.cache.get(guild.ownerID).tag} (${guild.ownerID})\``)
        .addField("> \`Ilość osób\`", `> \`${guild.memberCount}\``)
        .setTimestamp()
    Sparfy.channels.cache.get("804779312392699954")?.send(guildDeleteEmbed);

}
