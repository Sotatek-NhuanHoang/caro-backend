const Promise = require('bluebird');
const _ = require('lodash');
const RoomClient = require('caro-repository-client/RoomClient');
const UserClient = require('caro-repository-client/UserClient');
const SocketClient = require('caro-repository-client/SocketClient');
const SocketServerEvents = require('caro-shared-resource/SocketServerEvents');


const RoomControllers = {
    createRoom: async (req, reply) => {
        try {
            const newRoom = await RoomClient.call('createRoom', { userId: req.user._id });
            const creatorUser = await UserClient.call('getUserById', { userId: req.user._id, });

            reply.status(200).send(newRoom);

            SocketClient.call('broadcast', {
                eventName: SocketServerEvents.room_ADD_NEW,
                params: {
                    room: newRoom,
                    creatorUser: creatorUser,
                },
            });
        } catch (error) {
            reply.status(500).send({ message: error.message });
        }
    },

    joinRoom: async (req, reply) => {
        try {
            const { roomId } = req.body;

            const joinedRoom = await RoomClient.call('joinRoom', { roomId: roomId, userId: req.user._id });
            const [creatorUser, joinedUser] = await Promise.all([
                UserClient.call('getUserById', { userId: joinedRoom.creatorUserId, }),
                UserClient.call('getUserById', { userId: req.user._id, }),
            ]);

            reply.status(200).send({
                room: joinedRoom,
                creatorUser: creatorUser,
            });

            SocketClient.call('broadcast', {
                eventName: SocketServerEvents.room_JOIN,
                params: {
                    room: joinedRoom,
                    competitorUser: joinedUser,
                },
            });
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
