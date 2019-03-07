const RepositoryName = require('caro-shared-resource/RepositoryName');
const UserModel = require('caro-database/UserModel');


module.exports = function() {
    this.add(`repo:${RepositoryName.USER_REPOSITORY},service:getUserByFacebookId`, async (msg, done) => {
        try {
            const { facebookId } = msg;
            const user = await UserModel.findOne({ facebookId: facebookId, });
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
