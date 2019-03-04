const mongoose = require('./index');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    facebookId: String,
    username: String,
});


module.exports = mongoose.model('users', UserSchema);
 