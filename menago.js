const { Client, MessageAttachment, MessageEmbed } = require("discord.js");
const { menago, main } = require("./config.json");
const Canvas = require("canvas");

class Bot extends Client {
	constructor(clientOptions) {
		super(clientOptions);

		this.log = require("./utils/logger.util").logger;

		this.on("ready", () => {
            this.log("ready", `Menago: Logged in as ${this.user.tag}`);
        });
		
		this.on("message", async msg => {
			if (!msg.guild) return;
			if (msg.author.bot) return;

			if (!msg.content.startsWith("+")) return;

			const args = msg.content.slice("+".length).trim().split(/ +/g);
			const cmd = args.shift().toLowerCase();

			if (!cmd.length) return;

			switch (cmd) {
				case "nakladka":
				case "nakładka": {
					const id = args[0] || msg.author.id;
					this.users.fetch(id.replace(/[<@!>]/g, ''))
					let user = this.users.cache.get(id.replace(/[<@!>]/g, ''));
					if (!user) user = msg.author;
					const canvas = Canvas.createCanvas(658, 658);
					const avatar = await Canvas.loadImage(user.avatarURL({ format: 'png', size: 512 }));
					const ctx = canvas.getContext('2d');
					const centerX = canvas.width / 2;
					const centerY = canvas.height / 2;
					const radius = 320;
					ctx.beginPath()
					ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false)
					ctx.clip()
					const overlay = await Canvas.loadImage("./nakladka.png", 658, 658)
					await ctx.drawImage(avatar, 0, 0, canvas.width, canvas.height)
					ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
					const attachment = new MessageAttachment(canvas.toBuffer(), 'avek.png');
					msg.channel.send(`> \`Nakładka dla ${user.tag}\``, attachment)
					break;
				}
				case "ogloszenie":
				case "ogłoszenie":
				case "ogl": {
					if (!msg.member.roles.cache.has("811893058105901106")) return;

					if (!args[0]) return msg.channel.send("> \`Podaj treść ogłoszenia\`");

					const content = args.join(" ").slice(0, 2000);

					msg.guild.channels.cache.get("745687758311260161").send(new MessageEmbed().setAuthor("Ogłoszenie", this.user.displayAvatarURL()).setColor(main).setDescription(content).setFooter(`Ogłoszenie od ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true })));
				}
			}
		})

        this.login(menago);
	} 
}

global.Menago = new Bot();