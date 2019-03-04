const AuthenticationMiddleware = require('../AuthenticationMiddleware');
const UserControllers = require('./UserControllers');


module.exports = async function routes (fastify, options, next) {
    // Get user by id
    fastify.route({
        method: 'GET',
        url: '/:id',
        preValidation: AuthenticationMiddleware,
        handler: (req, reply) => {
            reply.code(400);
            reply.send({
                error: 'fail'
            });
        },
    });

    // User login by facebook
    fastify.route({
        method: 'POST',
        url: '/facebook/login',
        handler: UserControllers.facebookLogin,
    });

    next();
};
