const jwt = require('jsonwebtoken');
const UserClient = require('caro-repository-client/UserClient');
const ServerError = require('caro-shared-resource/ServerError');


module.exports = async (req, reply, next) => {
    const authenticationHeader = req.headers['Authorization'] || '';
    const [bearer, token] = authenticationHeader.split(' ');

    if (!authenticationHeader || bearer !== 'Bearer') {
        reply.code(401)
            .send({
                message: ServerError.UNAUTHENTICATED,
            });
        return;
    }


    jwt.verify(token, process.env.SERVER_SECRET_KEY, { algorithms: process.env.SERVER_SECRET_ALGORITHM, }, async (err, decoded) => {
        if (err) {
            reply.code(401)
                .send({
                    message: ServerError.UNAUTHENTICATED,
                });
            return;
        }

        try {
            const { userId } = decoded;
            const user = await UserClient.call('getUserById', { userId: userId, });

            if (!user) {
                throw new Error(ServerError.USER_NOT_FOUND);
            }

            req.user = user;
            next();
        } catch (error) {
            reply.code(401)
                .send({
                    message: ServerError.UNAUTHENTICATED,
                });
        }
    });
};
