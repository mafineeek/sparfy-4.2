const { Schema, model } = require("mongoose");

const adCheckingSchema = new Schema({
	// (guildId, messageId, userId, content, embed, timestamp)
	guildID: {
		type: String,
		unique: true,
		required: true
	},
	messageID: {
		type: String
	},
	userID: {
		type: String
	},
	content: {
		type: String
	},
	embed: {
		type: String
	},
	timestamp: {
		type: Number
	}
});

exports.model = model("adChecking", adCheckingSchema);