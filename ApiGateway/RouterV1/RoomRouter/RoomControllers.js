const Promise = require('bluebird');
const _ = require('lodash');
const RoomClient = require('caro-repository-client/RoomClient');
const UserClient = require('caro-repository-client/UserClient');
const MatchClient = require('caro-repository-client/MatchClient');
const SocketClient = require('caro-repository-client/SocketClient');
const SocketServerEvents = require('caro-shared-resource/SocketServerEvents');


const RoomControllers = {
    createRoom: async (req, reply) => {
        try {
            const [newRoom, creatorUser] = await Promise.all([
                RoomClient.call('createRoom', { userId: req.user._id }),
                UserClient.call('getUserById', { userId: req.user._id, })
            ])

            await MatchClient.call('createMatch', {
                roomId: newRoom._id,
            });

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
                MatchClient.call('updateMatchStatus', {
                    roomId: roomId,
                    firstMoveUserId: joinedRoom.creatorUserId,
                    isCreatorUserTurn: true,
                }),
            ]);

            reply.status(200).send({
                room: joinedRoom,
                creatorUser: creatorUser,
            });

            // Update room
            SocketClient.call('broadcast', {
                eventName: SocketServerEvents.room_ADD_NEW,
                params: {
                    room: joinedRoom,
                    creatorUser: creatorUser,
                },
            });
            SocketClient.call('sendUserId', {
                eventName: SocketServerEvents.room_JOIN,
                userId: joinedRoom.creatorUserId,
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

            const [rooms] = await Promise.all([
                RoomClient.call('getAvailableRoomsByPage', { page: page, limit: limit, }),
                // RoomClient.call('getTotalAvailableRooms')
            ]);

            const creatorUserIds = _.map(rooms, (room) => room.creatorUserId);
            const creatorUsers = await UserClient.call('getUsersByIds', { userIds: creatorUserIds, });

            reply.status(200).send({
                rooms: rooms,
                total: 0,
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
