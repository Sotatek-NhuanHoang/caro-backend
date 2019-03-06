const SocketClientEvents = require('caro-shared-resource/SocketClientEvents');
const SocketServerEvents = require('caro-shared-resource/SocketServerEvents');


const RoomHandler = (io, socket, eventName, params) => {
    switch (eventName) {
        case SocketClientEvents.room_EXIT: {
            const { roomId, competitorUserId } = params;
            io.to(competitorUserId).emit(SocketServerEvents.room_EXIT, {
                roomId: roomId,
            });
            break;
        }
    }
};


module.exports = RoomHandler;
