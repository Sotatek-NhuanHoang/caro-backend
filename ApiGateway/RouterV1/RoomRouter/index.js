const AuthenticationMiddleware = require('../AuthenticationMiddleware');
const RoomControllers = require('./RoomControllers');


module.exports = async function routes (fastify, options, next) {
    // Create new room
    fastify.route({
        method: 'POST',
        url: '/',
        preValidation: AuthenticationMiddleware,
        handler: RoomControllers.createRoom,
    });

    // Get rooms
    fastify.route({
        method: 'GET',
        url: '/available',
        preValidation: AuthenticationMiddleware,
        handler: RoomControllers.getRooms,
    });

    next();
};