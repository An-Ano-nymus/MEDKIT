const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
	fileName: String,
	summary: String,
	medications: [String],
	sideEffects: [String],
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Report', reportSchema);