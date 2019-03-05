const mongoose = require('./index');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const RoomSchema = new Schema({
    creatorUserId: ObjectId,
    competitorUserId: ObjectId,
    status: String,
    firstMoveUser: ObjectId,
    updated: Date,
});


module.exports = mongoose.model('rooms', RoomSchema);
 