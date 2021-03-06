const AuthenticationMiddleware = require('../AuthenticationMiddleware');
const UserControllers = require('./UserControllers');


module.exports = async function routes (fastify, options, next) {
    // User login by facebook
    fastify.route({
        method: 'POST',
        url: '/facebook/login',
        handler: UserControllers.facebookLogin,
    });

    next();
};
