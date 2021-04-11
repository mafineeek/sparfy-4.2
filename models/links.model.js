const { Schema, model } = require("mongoose");

const linksSchema = new Schema({
	// link, guildId, bg, redirect, color, desc
	link: {
		type: String
	},
	guildID: {
		unique: true,
		required: true,
		type: String
	},
	bg: {
		type: String
	},
	color: {
		type: String
	},
	desc: {
		type: String
	},
	redirect: {
		type: Number
	}
});

exports.model = model("links", linksSchema);