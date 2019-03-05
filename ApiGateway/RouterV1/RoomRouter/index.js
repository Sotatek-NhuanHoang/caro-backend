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

    // Join room
    fastify.route({
        method: 'PUT',
        url: '/join',
        preValidation: AuthenticationMiddleware,
        handler: RoomControllers.joinRoom,
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
