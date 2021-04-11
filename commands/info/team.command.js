const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "team",
    aliases: ["zespol", "zespół"],
    run: async ({msg}) => {

        const supportGuild = Menago.guilds.cache.get("745685581366952056");

        const owners = await supportGuild.members.cache.filter(m => m.roles.cache.has("745687717081514085")).first() ? await supportGuild.members.cache.filter(m => m.roles.cache.has("745687717081514085")).map(m => `<@!${m.id}> **-** **\`${m.user.tag}\`**`) : "**\`Brak\`**";
        const team = await supportGuild.members.cache.filter(m => m.roles.cache.has("756941919409537154")).first() ? await supportGuild.members.cache.filter(m => m.roles.cache.has("756941919409537154")).map(m => `<@!${m.id}> **-** **\`${m.user.tag}\`**`) : "**\`Brak\`**";
        const verificators = await supportGuild.members.cache.filter(m => m.roles.cache.has("745687740292530176")).first() ? await supportGuild.members.cache.filter(m => m.roles.cache.has("745687740292530176")).map(m => `<@!${m.id}> **-** **\`${m.user.tag}\`**`) : "**\`Brak\`**";
        const administrators = await supportGuild.members.cache.filter(m => m.roles.cache.has("745687718754910329")).first() ? await supportGuild.members.cache.filter(m => m.roles.cache.has("745687718754910329")).map(m => `<@!${m.id}> **-** **\`${m.user.tag}\`**`) : "**\`Brak\`**";
        const moderators = await supportGuild.members.cache.filter(m => m.roles.cache.has("745687720155938836")).first() ? await supportGuild.members.cache.filter(m => m.roles.cache.has("745687720155938836")).map(m => `<@!${m.id}> **-** **\`${m.user.tag}\`**`) : "**\`Brak\`**";
        const support = await supportGuild.members.cache.filter(m => m.roles.cache.has("745687721045000242")).first() ? await supportGuild.members.cache.filter(m => m.roles.cache.has("745687721045000242")).map(m => `<@!${m.id}> **-** **\`${m.user.tag}\`**`) : "**\`Brak\`**";
        const trialSupport = await supportGuild.members.cache.filter(m => m.roles.cache.has("762981488073375765")).first() ? await supportGuild.members.cache.filter(m => m.roles.cache.has("762981488073375765")).map(m => `<@!${m.id}> **-** **\`${m.user.tag}\`**`) : "**\`Brak\`**";
        const teamEmbed = new MessageEmbed()
            .setColor(Sparfy.config.main)
            .setAuthor(`Zespół bota ${Sparfy.user.username}`, Sparfy.user.displayAvatarURL())
            .addField("> \`CEO\`", owners)
            .addField("> \`Zarząd Sparfy.net\`", team)
            .addField("> \`Administratorzy\`", administrators)
            .addField("> \`Moderatorzy\`", moderators)
            .addField("> \`Support\`", support)
            .addField("> \`Trial Support\`", trialSupport)
            .addField("> \`Weryfikatorzy reklam\`", verificators)
            .setFooter(`Wykonano dla ${msg.author.tag}`, msg.author.displayAvatarURL({dynamic: true}))
        msg.channel.send(teamEmbed)
    }
}