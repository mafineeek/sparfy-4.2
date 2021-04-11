const express = require("express");
const links = models.get("links");
const settings = models.get("settings");
const app = express();

app.use(express.static(`${__dirname}/public`));
app.set("view engine", "ejs");

module.exports = (bot) => {

    app.get("/", (req, res) => {

        res.render("main", {
            bot,
            team: {
                dioxtarr: Menago.users.cache.get("493119070032363541"),
                kacperrrooo: Menago.users.cache.get("512230433782497281"),
                mateusz: Menago.users.cache.get("395266229436153868"),
            }
        });
    })

    app.get("/:link", async (req, res) => {
        const link = decodeURIComponent(req.params.link);

        const linkData = await links.findOne({ link }).exec();;

        if (!linkData) return res.redirect("/");

        const guild = bot.guilds.cache.get(linkData.guildID);

        if (!guild) return res.redirect("/");

        const guildData = await settings.findOne({ guildID: guild.id }).exec();

        if (!guildData || !guildData.invite) return res.redirect("/");

        if (linkData.redirect === 1 && (!req.query.redirect || req.query.redirect.toString() !== "false")) return res.redirect(guildData.invite);

        guild.desc = linkData.desc || ""

        guild.color = linkData.color;

        guild.bg = linkData.bg

        guild.invite = guildData.invite

        res.render("server", {
            bot,
            guild
        })
    });

    app.get("*", (req, res) => {
        res.redirect("/");
    });

    app.post("*", (req, res) => {
        res.redirect(req.path);
    });

    app.listen(bot.config.port, () => {
        bot.log("ready", `Website listening on port ${bot.config.port}`);
    });
}
