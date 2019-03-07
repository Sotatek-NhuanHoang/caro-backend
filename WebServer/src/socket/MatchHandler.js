import SocketServerEvents from 'caro-shared-resource/SocketServerEvents';
import { dispatch, getState } from 'caro-store';
import { match_UPDATE_STATE, checkWinningMatchFromIndex } from 'caro-store/match';
import Config from 'caro-config';
import sleep from 'sleep-promise';


const RoomHandler = async (eventName, params) => {
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
                lastSquareIndex: competitorSquareIndex,
            }));

            const { match: nextMatch } = getState();
            const winningSquares = checkWinningMatchFromIndex(nextMatch.squares, row, column);

            if (winningSquares) {
                dispatch(match_UPDATE_STATE({
                    winningSquares: winningSquares,
                }));

                await sleep(1500);
                dispatch(match_UPDATE_STATE({
                    winnerId: competitorUserId,
                }));
            } else {
                dispatch(match_UPDATE_STATE({
                    isCurentUserTurn: true,
                }));
            }
            break;
        }

        case SocketServerEvents.match_READY_NEW_GAME: {
            const { roomId } = params;
            const { room } = getState();
            
            if (roomId !== room.currentRoomId) {
                return;
            }

            dispatch(match_UPDATE_STATE({
                competitorUserReadyNewGame: true,
            }));
            break;
        }

        default:
            break;
    }
};


export default RoomHandler;
