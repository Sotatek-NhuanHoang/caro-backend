const request = require('request-promise');
const UserClient = require('caro-repository-client/UserClient');


const UserControllers = {
    facebookLogin: async (req, reply) => {
        try {
            const { accessToken, facebookId } = req.body;
            
            let user = await UserClient.call('getUserByFacebookId', { facebookId });

            if (!user) { // Create new
                const response = await request({
                    uri: 'https://graph.facebook.com/v3.2/me?fields=id%2Cname&access_token=' + accessToken,
                    json: true,
                });
                user = await UserClient.call('createUser', {
                    facebookId: facebookId,
                    username: response.name,
                });
            }

            reply.status(200).send(user);
        } catch (error) {
            reply.status(500)
                .send({
                    message: error.message,
                });
        }
    },
};


module.exports = UserControllers;
