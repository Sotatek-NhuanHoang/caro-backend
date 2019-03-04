const RepositoryName = require('caro-shared-resource/RepositoryName');
const UserModel = require('caro-database/UserModel');


module.exports = function() {
    this.add(`repo:${RepositoryName.USER_REPOSITORY},service:getUserByFacebookId`, async (msg, done) => {
        try {
            const { facebookId } = msg;
            const user = await UserModel.findOne({ facebookId: facebookId, });
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};
