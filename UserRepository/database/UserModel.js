const mongoose = require('./index');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    facebookId: String,
    username: String,
    avatar: String,
});


module.exports = mongoose.model('users', UserSchema);
 