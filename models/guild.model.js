const { Schema, model } = require("mongoose");

const guildSchema = new Schema({
	guildID: {
		unique: true,
		required: true,
		type: String
	},
	prefix: {
		type: String
	}
});

exports.model = model("guild", guildSchema);