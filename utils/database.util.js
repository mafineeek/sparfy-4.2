const { connect } = require("mongoose");
const { readdirSync } = require("fs");

module.exports = async (bot) => {
	await connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	});

	bot.log("info", "Successfully connected to MongoDB server!");

	global.models = new Map();

	readdirSync("./models/").filter(x => x.endsWith(".model.js") && !x.startsWith("--")).forEach(file => {

		const { model } = require(`../models/${file}`);

		if (!model) return;

		models.set(file.split(".")[0], model);
	});
}