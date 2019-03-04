const RepositoryName = require('caro-shared-resource/RepositoryName');
const UserModel = require('caro-database/UserModel');


module.exports = function() {
    this.add(`repo:${RepositoryName.USER_REPOSITORY},service:createUser`, async (msg, done) => {
        try {
            const { username, facebookId } = msg;
            
            let existedUser = await UserModel.findOne({ facebookId: facebookId, });

            if (!existedUser) {
                existedUser = await UserModel.create({
                    facebookId: facebookId,
                    username: username,
                });
            }

            console.log(existedUser)

            done(null, existedUser);
        } catch (error) {
            done(error);
        }
    });
};
