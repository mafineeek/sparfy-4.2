const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["pomoc", "p", "h"],
    run: async ({ msg }) => {
        const adsCommands = [
            `> \`${msg.guild.prefix}kanał\` \`=>\` **\`Ustawia kanał reklam serwera\`**`,
            `> \`${msg.guild.prefix}reklama\` \`=>\` **\`Ustawia reklamę serwera\`**`,
        ];
        const customUrlCommands = [
            `> \`${msg.guild.prefix}ustaw\` \`=>\` **\`Ustawienia custom url\`**`
        ];
        const settingsCommands = [
            `> \`${msg.guild.prefix}prefix\` \`=>\` **\`Ustawia prefix serwera\`**`,
            `> \`${msg.guild.prefix}regenerate\` \`=>\` **\`Regeneracja zaproszenia na serwer\`**`,
        ];
        const infoCommands = [
            `> \`${msg.guild.prefix}linki\` \`=>\` **\`Linki dot. Bota ${Sparfy.user.username}\`**`,
            `> \`${msg.guild.prefix}ping\` \`=>\` **\`Ping bota z WS Discorda\`**`,
			`> \`${msg.guild.prefix}status\` \`=>\` **\`Status konfiguracji serwera\`**`,
			`> \`${msg.guild.prefix}botinfo\` \`=>\` **\`Informacje o bocie ${Sparfy.user.username}\`**`
        ];
        const helpEmbed = new MessageEmbed()
            .setAuthor(`Menu pomocy ${Sparfy.user.username}`, Sparfy.user.displayAvatarURL())
            .setColor(Sparfy.config.main)
            .setDescription(`**\`\`\`http\nREKLAMOWANIE\`\`\`**
${adsCommands.join("\n")}
**\`\`\`http\nCUSTOM URL\`\`\`**
${customUrlCommands.join("\n")}
**\`\`\`http\nUSTAWIENIA\`\`\`**
${settingsCommands.join("\n")}
**\`\`\`http\nINFORMACJE\`\`\`**
${infoCommands.join("\n")}`)
            .setFooter(`Wykonano dla ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true }))
        msg.channel.send(helpEmbed);
    }
}