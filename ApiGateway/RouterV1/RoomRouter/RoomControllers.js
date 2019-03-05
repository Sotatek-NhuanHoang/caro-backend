const Promise = require('bluebird');
const _ = require('lodash');
const RoomClient = require('caro-repository-client/RoomClient');
const UserClient = require('caro-repository-client/UserClient');


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
            const limit = req.query.limit || 30;

            const [rooms, { total }] = await Promise.all([
                RoomClient.call('getAvailableRoomsByPage', { page: page, limit: limit, }),
                RoomClient.call('getTotalAvailableRooms')
            ]);

            const creatorUserIds = _.map(rooms, (room) => room.creatorUserId);
            const creatorUsers = await UserClient.call('getUsersByIds', { userIds: creatorUserIds, });

            reply.status(200).send({
                rooms: rooms,
                total: total,
                page: page,
                limit: limit,
                creatorUsers: creatorUsers,
            });
        } catch (error) {
            reply.status(500).send({ message: error.message });
        }
    }
};


module.exports = RoomControllers;
