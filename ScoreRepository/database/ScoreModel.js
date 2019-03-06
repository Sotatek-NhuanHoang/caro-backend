const mongoose = require('./index');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const ScoreSchema = new Schema({
    userId: ObjectId,
    competitorUserId: ObjectId,
    score: Number,
});


module.exports = mongoose.model('scores', ScoreSchema);
 