const request = require('request-promise');
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');
const UserClient = require('caro-repository-client/UserClient');


const UserControllers = {
    facebookLogin: async (req, reply) => {
        try {
            const { accessToken, facebookId } = req.body;
            
            let user = await UserClient.call('getUserByFacebookId', { facebookId });

            if (!user) { // Create new
                const [userProfileResponse, userAvatarResponse] = await Promise.all([
                    request({
                        uri: 'https://graph.facebook.com/v3.2/me?fields=id%2Cname&access_token=' + accessToken,
                        json: true,
                    }),
                    request({
                        uri: `https://graph.facebook.com/v3.2/${facebookId}/picture?type=large&redirect=false&access_token=${accessToken}`,
                        json: true,
                    })
                ]);

                user = await UserClient.call('createUser', {
                    facebookId: facebookId,
                    username: userProfileResponse.name,
                    avatar: userAvatarResponse.data.url,
                });
            }

            const token = jwt.sign({ userId: user._id }, process.env.SERVER_SECRET_KEY, { algorithm: process.env.SERVER_SECRET_ALGORITHM, });
            reply.status(200).send({
                ...user,
                token: token,
            });
        } catch (error) {
            reply.status(500)
                .send({
                    message: error.message,
                });
        }
    },
};


module.exports = UserControllers;
