const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
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