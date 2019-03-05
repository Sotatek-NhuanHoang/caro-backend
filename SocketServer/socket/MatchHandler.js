const SocketClientEvents = require('caro-shared-resource/SocketClientEvents');
const SocketServerEvents = require('caro-shared-resource/SocketServerEvents');


const MatchHandler = (io, socket, eventName, params) => {
    switch (eventName) {
        case SocketClientEvents.match_STROKE: {
            const { roomId, row, column, competitorUserId } = params;
            io.to(competitorUserId).emit(SocketServerEvents.match_STROKE, {
                roomId: roomId,
                row: row,
                column: column,
            });
        }
    }
};


module.exports = MatchHandler;