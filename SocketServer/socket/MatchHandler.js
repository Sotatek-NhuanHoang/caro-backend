const SocketClientEvents = require('caro-shared-resource/SocketClientEvents');
const SocketServerEvents = require('caro-shared-resource/SocketServerEvents');
const ScoreClient = require('caro-repository-client/ScoreClient');


const MatchHandler = async (io, socket, eventName, params) => {
    switch (eventName) {
        case SocketClientEvents.match_STROKE: {
            const { roomId, row, column, competitorUserId, userId } = params;
            io.to(competitorUserId).emit(SocketServerEvents.match_STROKE, {
                roomId: roomId,
                row: row,
                column: column,
                competitorUserId: userId,
            });
            break;
        }

        case SocketClientEvents.match_READY_NEW_GAME: {
            const { roomId, competitorUserId } = params;
            io.to(competitorUserId).emit(SocketServerEvents.match_READY_NEW_GAME, {
                roomId: roomId,
            });
            break;
        }

        case SocketClientEvents.match_WIN: {
            const { userId, competitorUserId } = params;
            const { score } = await ScoreClient.call('increaseScore', {
                userId: userId,
                competitorUserId: competitorUserId,
            });

            io.to(userId).emit(SocketServerEvents.score_UPDATE, {
                scores: [score],
            });
            io.to(competitorUserId).emit(SocketServerEvents.score_UPDATE, {
                scores: [score],
            });
            break;
        }
    }
};


module.exports = MatchHandler;