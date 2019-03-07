const RepositoryName = require('caro-shared-resource/RepositoryName');
const UserModel = require('caro-database/UserModel');


module.exports = function() {
    this.add(`repo:${RepositoryName.USER_REPOSITORY},service:getUserById`, async (msg, done) => {
        try {
            const { userId } = msg;
            const user = await UserModel.findOne({ _id: userId, });
            done(null, {
                ok: 1,
                data: user,
            });
        } catch (error) {
            done({
                ok: 0,
                data: error.message,
            });
        }
    });
};