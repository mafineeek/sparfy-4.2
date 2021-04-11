const { isHexColor } = require("validator")
const links = models.get("links");
const settings = models.get("settings");

module.exports = {
    name: "ustaw",
    aliases: ["ustaw-link", "ustaw-url", "set-url", "config-url"],
    perm: "MANAGE_GUILD",
    run: async ({msg, args, cmd}) => {
        if (!args[0]) return {
            type: "error",
            text: `> \`Błędne użycie!\`\n> \`${msg.guild.prefix}${cmd} <link/kolor/opis/tło/przekierowanie> <wartość>\``
        }

        switch (args[0].toLowerCase()) {

            case "link": {

                if (!args[1]) return {
                    type: "error",
                    text: `> \`Błędne użycie!\`\n> \`${msg.guild.prefix}${cmd} ${args[0].toLowerCase()} <wartość>\``
                }

                if (args[1].length > 10) return {
                    type: "error",
                    text: "> \`Link może mieć maksymalnie 10 znaków!\`"
                }

                const url = encodeURIComponent(args[1].toLowerCase());

                const guildData = await settings.findOne({ guildID: msg.guild.id }).exec();

                let invite = guildData?.invite

                if (!guildData || !guildData.invite || !invite) {
                    if (!msg.guild.me.hasPermission("CREATE_INSTANT_INVITE")) return {
                        type: "error",
                        text: "> \`Bot nie ma permisji do tworzenia zaproszeń!\`"
                    }

                    invite = await msg.channel.createInvite({maxAge: 0}).catch(() => {});

                    if (!invite) return {
                        type: "error",
                        text: "> \`Nie udało się utworzyć zaprosznia na kanał!\`"
                    }

                    invite = `https://discord.gg/${invite.code}`;
                }

                const linkCheck = await links.findOne({ link: args[1].toLowerCase() }).exec();

                if (linkCheck) return {
                    type: "error",
                    text: `> \`Ten link jest już zajęty!\``
                }

                const linkData = await links.findOne({ guildID: msg.guild.id }).exec();

                if (!linkData) {
                    // db.prepare("INSERT INTO links (guildId, link, bg, redirect, color) VALUES(?,?,?,?,?)").run(msg.guild.id, args[1].toLowerCase(), "https://media.discordapp.net/attachments/784780086637363271/789846117328093224/To_sparfy.png", 0, Sparfy.config.main);
					await links.insertMany([{ guildID: msg.guild.id, link: args[1].toLowerCase(), redirect: 0, color: Sparfy.config.main, bg: "https://media.discordapp.net/attachments/784780086637363271/789846117328093224/To_sparfy.png" }]);
                } else {
					await links.updateOne({ guildID: msg.guild.id }, { link: args[1].toLowerCase() });
                }

                return {
                    text: `> [\`Link został ustawiony!\`](${Sparfy.config.url}/${url})`
                }
            }

            case "desc": 
            case "opis": {
                const linkCheck = await links.findOne({ guildID: msg.guild.id }).exec();

                if (!linkCheck) return {
                    type: "error",
                    text: "> \`Najpierw ustaw custom link!\`"
                }

                if (!args[1]) return {
                    type: "error",
                    text: `> \`Błędne użycie!\`\n> \`${msg.guild.prefix}${cmd} ${args[0].toLowerCase()} <wartość>\``
                }

                const desc = args.slice(1).join(" ");
                
                if (desc.length > 500) return {
                    type: "error",
                    text: "> \`Opis może mieć maksymalnie 500 znaków!\`"
                }

				await links.updateOne({ guildID: msg.guild.id }, { desc }).exec();

                return {
                    text: "> \`Opis został zmieniony!\`",
                }
            }

            case "tlo":
            case "tło": {
                const linkCheck = await links.findOne({ guildID: msg.guild.id }).exec();

                if (!linkCheck) return {
                    type: "error",
                    text: "> \`Najpierw ustaw custom link!\`"
                }

                if (!args[1]) return {
                    type: "error",
                    text: `> \`Błędne użycie!\`\n> \`${msg.guild.prefix}${cmd} ${args[0].toLowerCase()} <wartość>\``
                }

                if (!new RegExp(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpg|png)/g).test(args[1])) return {
                    type: "error",
                    text: "> \`Podaj poprawny link do tła!\`"
                }

                await links.updateOne({ guildID: msg.guild.id }, { bg: args[1] }).exec();

                return {
                    text: "> \`Tło zostało zmienione!\`"
                }
            }

            case "kolor": {
                const linkCheck = await links.findOne({ guildID: msg.guild.id }).exec();

                if (!linkCheck) return {
                    type: "error",
                    text: "> \`Najpierw ustaw custom link!\`"
                }

                if (!args[1]) return {
                    type: "error",
                    text: `> \`Błędne użycie!\`\n> \`${msg.guild.prefix}${cmd} ${args[0].toLowerCase()} <wartość>\``
                }

                if (!isHexColor(args[1])) return {
                    type: "error",
                    text: "> \`Podaj poprawny kolor hex!\`"
                }

                await links.updateOne({ guildID: msg.guild.id }, { color: args[1] }).exec();

                return {
                    text: "> \`Kolor został zmieniony!\`"
                }
            }

            case "przekierowanie":
            case "redirect": {
                const linkCheck = await links.findOne({ guildID: msg.guild.id }).exec();

                if (!linkCheck) return {
                    type: "error",
                    text: "> \`Najpierw ustaw custom link!\`"
                }

                if (!args[1]) return {
                    type: "error",
                    text: `> \`Błędne użycie!\`\n> \`${msg.guild.prefix}${cmd} ${args[0].toLowerCase()} <wlacz/wylacz>\``
                }

                switch (args[1].toLowerCase()) {
                    case "on":
                    case "wlacz":
                    case "włącz": {
                        if (linkCheck.redirect === 1) return {
                            type: "error",
                            text: "> \`Przekierowanie jest już włączone!\`"
                        }


                        await links.updateOne({ guildID: msg.guild.id }, { redirect: 1 }).exec();

                        return {
                            text: "> \`Przekierowanie zostało włączone!\`"
                        }
                    }

                    case "off":
                    case "wylacz":
                    case "wyłącz": {
                        if (linkCheck.redirect === 0) return {
                            type: "error",
                            text: "> \`Przekierowanie jest wyłączone!\`"
                        }

                        await links.updateOne({ guildID: msg.guild.id }, { redirect: 0 }).exec();

                        return {
                            text: "> \`Przekierowanie zostało wyłączone!\`"
                        }
                    }
                }
            }

            default: return {
                type: "error",
                text: `> \`Błędne użycie!\`\n> \`${msg.guild.prefix}${cmd} <link/kolor/opis/tło/przekierowanie> <wartość>\``
            }
        }
    }
}