const chalk = require("chalk");
const moment = require("dayjs");

const logger = (type, content) => {
	const timestamp = moment(new Date()).format("DD.MM.YYYY HH:mm:ss");
	switch (type.toLowerCase()) {
		case "ready": {
			console.log(`${chalk.bgGreen("READY")} => ${chalk.green(`[${timestamp}] ${content}`)}`);
			break;
		}
		case "warn": {
			console.log(`${chalk.bgYellow("WARN")} => ${chalk.yellow(`[${timestamp}] ${content}`)}`);
			break;
		}
		case "error": {
			console.log(`${chalk.bgRed("ERROR")} => ${chalk.red(`[${timestamp}] ${content}`)}`);
			break;
		}
		case "info": {
			console.log(`${chalk.bgBlue("INFO")} => ${chalk.blue(`[${timestamp}] ${content}`)}`);
			break;
		}
	}
}

exports.logger = logger;