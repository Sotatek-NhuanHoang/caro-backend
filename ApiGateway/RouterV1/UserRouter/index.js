const AuthenticationMiddleware = require('../AuthenticationMiddleware');


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

    next();
};
