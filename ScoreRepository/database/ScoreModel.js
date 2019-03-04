const mongoose = require('./index');
const Schema = mongoose.Schema;


const ScoreSchema = new Schema({
    userId: String,
    competitorUserId: String,
    score: Number,
});


module.exports = mongoose.model('scores', ScoreSchema);
 