const { Schema, model } = require("mongoose");

const adsSchema = new Schema({
	// guildId, number, content, sent, queue
	guildID: {
		type: String,
		required: true
	},
	number: {
		type: Number
	},
	content: {
		type: String
	},
	sent: {
		type: Number
	},
	queue: {
		type: Number
	}
});

exports.model = model("ads", adsSchema);