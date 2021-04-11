const { gbanCheck } = require("../../utils/gbanCheck.util");
const gbans = require("../../gbans.json");
const { writeFileSync } = require("fs");
const { stringify } = JSON;

module.exports = {
	name: "gban",
	aliases: ["global-ban"],
	run: async ({msg, args}) => {
		if (!Sparfy.config.owners.includes(msg.author.id)) return {
			type: "error",
			text: "> \`Nie jesteś właścicielem bota!\`"
		}

		if (!args[0]) return {
			type: "error",
			text: "> \`Podaj id/wzmiankę osoby do gbana!\`"
		}

		args[0] = args[0].replace(/[<@!>]/g, '');

		const data = gbanCheck(args[0]);

		if (data) {
			delete gbans[args[0]];
			writeFileSync("./gbans.json", stringify(gbans, null, 4));
			return {
				text: "> \`Globalna blokada została zdjęta\`"
			}
		} else {
			gbans[args[0]] = {
				reason: args[1] ? args.slice(1).join(" ") : "Nie podano",
				who: `${msg.author.tag} | ${msg.author.id}`,
				timestamp: Date.now()
			}

			writeFileSync("./gbans.json", stringify(gbans, null, 4));
			return {
				text: "> \`Globalna blokada została nałożona\`"
			}
		}
	}
}