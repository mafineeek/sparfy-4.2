const { readdirSync } = require("fs");

module.exports = (bot) => {
	let i = 1;
	readdirSync("./events/").filter(x => x.endsWith(".event.js") && !x.startsWith("--")).forEach(file => {
		const num = i;
		i++;
		try {
			const event = require(`../events/${file}`);

			const name = file.split(".")[0];

			bot.on(name, (...args) => event(bot, ...args));
			bot.log("info", `[${num}] ${file} loaded successfully`)
		} catch (e) {
			bot.log("error", `[${num}] Error while loading ${file}`);
			console.log(e);
		}
	});
}