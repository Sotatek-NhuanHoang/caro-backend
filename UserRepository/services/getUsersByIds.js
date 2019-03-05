const RepositoryName = require('caro-shared-resource/RepositoryName');
const UserModel = require('caro-database/UserModel');


module.exports = function() {
    this.add(`repo:${RepositoryName.USER_REPOSITORY},service:getUsersByIds`, async (msg, done) => {
        try {
            const { userIds } = msg;
            const users = await UserModel.find({
                _id: { $in: userIds, },
            });
            done(null, users);
        } catch (error) {
            done(error);
        }
    });
};
