// Load env
require('dotenv').config();
const fastify = require('fastify')({
    // logger: true,
    ignoreTrailingSlash: true,
    bodyLimit: 10000,
});



/**
 * Middlewares
 */

// Enable cors
fastify.register(require('fastify-cors'));

// Helmet
fastify.register(require('fastify-helmet'));

// X Xss protection
fastify.use(require('x-xss-protection')());



/**
 * V1 router
 */

// User Router /users
fastify.register(require('caro-router-v1/UserRouter'), { prefix: '/v1/users' });



/**
 * Start server
 */
fastify.listen(process.env.SERVER_PORT, function (err, address) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`server listening on ${address}`);
});
