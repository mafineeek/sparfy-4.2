const { Schema, model } = require("mongoose");

const queueSchema = new Schema({
	number: {
		type: Number
	}
});

exports.model = model("queue", queueSchema);