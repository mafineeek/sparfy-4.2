const { MessageEmbed } = require("discord.js");

const content = [
    "> <:742702150873776170:768167991283286046> \`=>\` **\`Link do bota\`**",
    "> <:735510516344029185:768167998380310528> \`=>\` **\`Strona bota\`**",
    "> <:744543898474381383:768167983519629322> \`=>\` **\`Serwer support\`**"
]

const emojis = [
    "742702150873776170:768167991283286046",
    "735510516344029185:768167998380310528",
    "744543898474381383:768167983519629322"
];

module.exports = {
    name: "linki",
    aliases: ["link", "dodaj", "zaproś", "zapros", "links", "sparfy"],
    run: async ({ msg }) => {

        const selectEmbed = new MessageEmbed()
            .setAuthor("Ładowanie!", "https://cdn.discordapp.com/emojis/742389699305406536.gif?v=1")
            .setColor(Sparfy.config.main)
        const m = await msg.channel.send(selectEmbed);

        await m.react(emojis[0]);
        await m.react(emojis[1]);
        await m.react(emojis[2])

        selectEmbed
            .setAuthor("Wybierz link!", Sparfy.user.displayAvatarURL()) // JEbać pis
            .setDescription(content.join("\n"))
            .setFooter(`Wykonano dla ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true }))
        m.edit(selectEmbed);

        const filter = (reaction, user) => {
            return user.id === msg.author.id;
        }

        const collector = await m.createReactionCollector(filter, { time: 20000 });

        let selected;

        collector.on("collect", (reaction, user) => {
            switch (reaction.emoji.id) {
                case emojis[0].split(":")[1]: {
                    selected = "botInvite";
                    collector.stop();
                    break;
                }
                case emojis[1].split(":")[1]: {
                    selected = "botWebsite";
                    collector.stop();
                    break;
                }
                case emojis[2].split(":")[1]: {
                    selected = "supportInvite";
                    collector.stop();
                    break;
                }

                default: reaction.users.remove(user.id);
            }
        });

        collector.on("end", () => {
            if (!selected) {
                selectEmbed
                    .setFooter(`Wykonano dla ${msg.author.tag} | Czas na dodanie reakcji minął!`, msg.author.displayAvatarURL({dynamic: true}))
                    .setAuthor("Koniec czasu!", Sparfy.user.displayAvatarURL())
                m.edit(selectEmbed);
                m.reactions.removeAll().catch(() => {});
            } else {

                const basicEmbed = new MessageEmbed()
                    .setAuthor("Wybrany link!", Sparfy.user.displayAvatarURL())
                    .setColor(Sparfy.config.main)
                    .setFooter(Sparfy.user.username)
                    .setTimestamp()


                let desc;
                switch (selected) {
                    case "botInvite": {
                        desc = "> <:742702150873776170:768167991283286046> \`Wybrano link do bota\`";
                        basicEmbed.setDescription(`> <:742702150873776170:768167991283286046> [**\`Link do bota\`**](https://discordapp.com/api/oauth2/authorize?client_id=695270481779228772&permissions=8&scope=bot)`)
                        break;
                    }
                    case "botWebsite": {
                        desc = "> <:735510516344029185:768167998380310528> \`Wybrano link do strony bota\`";
                        basicEmbed.setDescription(`> <:735510516344029185:768167998380310528> [**\`Strona bota\`**](https://sparfy.net)`)
                        break;
                    }
                    case "supportInvite": {
                        desc = "> <:744543898474381383:768167983519629322> \`Wybrano link do serwera support\`";
                        basicEmbed.setDescription(`> <:744543898474381383:768167983519629322> [**\`Serwer support\`**](${Sparfy.config.support.invite})`)
                        break;
                    }
                }
                msg.author.send(basicEmbed).catch(() => {});;
                selectEmbed.setDescription(desc);
                m.edit(selectEmbed);
                m.reactions.removeAll().catch(() => {});
            }
        })
    }
}