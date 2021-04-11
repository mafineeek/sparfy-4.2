const { readdirSync } = require("fs");

module.exports = (bot) => {
	let i = 1;
	readdirSync("./commands/").forEach(dir => {
		readdirSync(`./commands/${dir}/`).filter(cmd => cmd.endsWith(".command.js") && !cmd.startsWith("--")).forEach(file => {
			const num = i;
			i++;
			try {
				const command = require(`../commands/${dir}/${file}`);

				if (!command.name || !command.run) return bot.log("warn", `[${num}] ${file} cannot be loaded!`);

				if (bot.commands.get(command.name)) return bot.log("warn", `[${num}] ${file} cannot be loaded!`);

				bot.commands.set(command.name, command);

				bot.log("info", `[${num}] ${file} loaded successfully`);

				if (!command.aliases && !Array.isArray(command.aliases)) return;

				command.aliases.forEach(alias => {
					if (bot.aliases.get(alias)) return;
					bot.aliases.set(alias, command.name);
				});
			} catch (e) {
				bot.log("error", `[${num}]  Error while loading ${file}`);
				console.log(e);
			}
		});
	});
}