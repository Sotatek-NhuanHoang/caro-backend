const RoomClient = require('caro-repository-client/RoomClient');
const Promise = require('bluebird');


const RoomControllers = {
    createRoom: async (req, reply) => {
        try {
            const newRoom = await RoomClient.call('createRoom', { userId: req.user._id });
            reply.status(200).send(newRoom);
        } catch (error) {
            reply.status(500).send({ message: error.message });
        }
    },

    getRooms: async (req, reply) => {
        try {
            const page = req.query.page || 1;
            const limit = req.query.limit || 20;

            const [rooms, { total }] = await Promise.all([
                RoomClient.call('getAvailableRoomsByPage', { page: page, limit: limit, }),
                RoomClient.call('getTotalAvailableRooms')
            ]);
            reply.status(200).send({
                rooms: rooms,
                total: total,
                page: page,
                limit: limit,
            });
        } catch (error) {
            reply.status(500).send({ message: error.message });
        }
    }
};


module.exports = RoomControllers;
