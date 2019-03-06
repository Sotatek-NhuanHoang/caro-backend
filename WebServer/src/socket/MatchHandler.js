import SocketServerEvents from 'caro-shared-resource/SocketServerEvents';
import { dispatch, getState } from 'caro-store';
import { match_UPDATE_STATE, checkWinningMatchFromIndex } from 'caro-store/match';
import Config from 'caro-config';


const RoomHandler = (eventName, params) => {
    switch (eventName) {
        case SocketServerEvents.match_STROKE: {
            const { roomId, row, column, competitorUserId } = params;
            const { room, match, user } = getState();
            
            if (roomId !== room.currentRoomId) {
                return;
            }

            const { currentUser } = user;
            const { firstMoveUserId } = match;
            const competitorSquareIndex = row + ',' + column;
            const competitorSquareType = currentUser.id === firstMoveUserId ? Config.SECOND_MOVE_SQUARE_TYPE : Config.FIRST_MOVE_SQUARE_TYPE;

            dispatch(match_UPDATE_STATE({
                squares: {
                    [competitorSquareIndex]: competitorSquareType,
                },
            }));

            const { match: nextMatch } = getState();
            const winningSquares = checkWinningMatchFromIndex(nextMatch.squares, row, column);

            if (winningSquares) {
                dispatch(match_UPDATE_STATE({
                    winningSquares: winningSquares,
                    winnerId: competitorUserId,
                }));
            } else {
                dispatch(match_UPDATE_STATE({
                    isCurentUserTurn: true,
                }));
            }
            break;
        }

        default:
            break;
    }
};


export default RoomHandler;
