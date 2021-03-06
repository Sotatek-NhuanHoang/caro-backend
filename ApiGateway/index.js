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

// Form body
fastify.register(require('fastify-formbody'));


// Status router
fastify.get('/status', (req, reply) => {
    reply.status(200).send('OK');
});


/**
 * V1 router
 */

// User Router /users
fastify.register(require('caro-router-v1/UserRouter'), { prefix: '/v1/users' });

// Room Router /rooms
fastify.register(require('caro-router-v1/RoomRouter'), { prefix: '/v1/rooms' });


/**
 * Start server
 */
fastify.listen(process.env.PORT || 8080, '0.0.0.0', function (err, address) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`server listening on ${address}`);
});
