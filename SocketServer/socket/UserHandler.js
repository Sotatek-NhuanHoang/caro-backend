const jwt = require('jsonwebtoken');
const _ = require('lodash');
const SocketClientEvents = require('caro-shared-resource/SocketClientEvents');
const SocketServerEvents = require('caro-shared-resource/SocketServerEvents');
const RoomClient = require('caro-repository-client/RoomClient');
const UserClient = require('caro-repository-client/UserClient');


const UserHandler = async (io, socket, eventName, params) => {
    switch (eventName) {
        case SocketClientEvents.user_AUTHENTICATE: {
            const { token } = params;

            jwt.verify(token, process.env.SERVER_SECRET_KEY, { algorithms: [process.env.SERVER_SECRET_ALGORITHM], }, async (err, decoded) => {
                if (err) {
                    socket.emit(SocketServerEvents.user_UNAUTHENTICATED);
                    return;
                }
                
                const { userId } = decoded;
                const user = await UserClient.call('getUserById', { userId: userId, });
                
                if (!user) {
                    socket.emit(SocketServerEvents.user_UNAUTHENTICATED);
                    return;
                }

                socket.userId = userId;
                socket.join(userId);
                socket.emit(SocketServerEvents.user_AUTHENTICATED);
            });
            break;
        }

        case SocketClientEvents.user_LOGOUT: {
            const { userId } = socket;

            if (!userId) {
                return;
            }

            socket.leave(userId);

            try {
                const { availableRooms, deletedRooms } = await RoomClient.call('leaveAllRooms', { userId: userId, });
                
                _.forEach(deletedRooms, (room) => {
                    io.emit(SocketServerEvents.room_REMOVE, {
                        roomId: room._id,
                    });
                });

                _.forEach(availableRooms, async (room) => {
                    try {
                        const creatorUser = await UserClient.call('getUserById', { userId: room.creatorUserId, });

                        io.emit(SocketServerEvents.room_ADD_NEW, {
                            room: room,
                            creatorUser: creatorUser,
                        });
                    } catch (error) {
                        console.log(error);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
    }
};


module.exports = UserHandler;
