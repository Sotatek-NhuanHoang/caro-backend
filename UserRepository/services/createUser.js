const RepositoryName = require('caro-shared-resource/RepositoryName');
const UserModel = require('caro-database/UserModel');


module.exports = function() {
    this.add(`repo:${RepositoryName.USER_REPOSITORY},service:createUser`, async (msg, done) => {
        try {
            const { username } = msg;
            console.log('username ', msg.username)
            
            let existedUser = await UserModel.findOne({ username: username, });

            if (!existedUser) {
                existedUser = await UserModel.create({ username: username, });
            }

            done(null, existedUser);
        } catch (error) {
            done(error);
        }
    });
};
