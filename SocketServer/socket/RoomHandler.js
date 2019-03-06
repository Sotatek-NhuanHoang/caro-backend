const SocketClientEvents = require('caro-shared-resource/SocketClientEvents');
const SocketServerEvents = require('caro-shared-resource/SocketServerEvents');
const RoomClient = require('caro-repository-client/RoomClient');
const UserClient = require('caro-repository-client/UserClient');


const RoomHandler = async (io, socket, eventName, params) => {
    switch (eventName) {
        case SocketClientEvents.room_EXIT: {
            const { roomId, userId, competitorUserId } = params;
            io.to(competitorUserId).emit(SocketServerEvents.room_EXIT, {
                roomId: roomId,
            });

            try {
                const { room, isDeleted } = await RoomClient.call('leaveRoom', {
                    roomId: roomId,
                    userId: userId,
                });
                
                if (isDeleted) {
                    io.emit(SocketServerEvents.room_REMOVE, {
                        roomId: roomId,
                    });
                } else {
                    const creatorUser = await UserClient.call('getUserById', { userId: room.creatorUserId, });

                    io.emit(SocketServerEvents.room_ADD_NEW, {
                        room: room,
                        creatorUser: creatorUser,
                    });
                }
            } catch (error) {
                
            }
            break;
        }
    }
};


module.exports = RoomHandler;
