const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const { readdirSync } = require("fs");

config({
	path: "./.env"
});

class Bot extends Client {
	constructor(clientOptions) {
		super(clientOptions);

		// Config
		this.config = require("./config.json");
		this.emoji = require("./emojis.json");

		// Collections
		this.commands = new Collection();
		this.aliases = new Collection();

		// Logger
		this.log = require("./utils/logger.util").logger;
		//this.on("debug", d => console.log(d));

		// Database
		require("./utils/database.util")(this).then(() => {
			// Website
			require("./web")(this);

			// Handlers
			readdirSync("./handlers/").filter(x => x.endsWith(".handler.js") && !x.startsWith("--")).forEach(file => {
				try {
					require(`./handlers/${file}`)(this);
					this.log("info", `Handler ${file} loaded successfully!`);
				} catch (e) {
					this.log("error", `Error while loading ${file}`);
					console.log(e);
				}
			});

			// Login into Discord API Gateway
			this.login(process.env.SPARFY_TOKEN);
		});
	}
}
require("./menago");
global.Sparfy = new Bot({ disableMentions: "all", partials: ["MESSAGE", "REACTION", "CHANNEL"], shards: [0, 1, 2, 3, 4] });
