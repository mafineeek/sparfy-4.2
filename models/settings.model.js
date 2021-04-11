const { Schema, model } = require("mongoose");

const settingsSchema = new Schema({
	guildID: {
		unique: true,
		required: true,
		type: String
	},
	channelID: {
		unique: true,
		type: String
	},
	adContent: {
		type: String
	},
	invite: {
		type: String
	}
});

exports.model = model("settings", settingsSchema);