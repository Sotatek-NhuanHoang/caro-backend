import SocketServerEvents from 'caro-shared-resource/SocketServerEvents';
import { dispatch, getState } from 'caro-store';
import { match_UPDATE_STATE } from 'caro-store/match';
import Config from 'caro-config';


const RoomHandler = (eventName, params) => {
    switch (eventName) {
        case SocketServerEvents.match_STROKE: {
            const { roomId, row, column } = params;
            const { room, match, user } = getState();
            
            if (roomId !== room.currentRoomId) {
                return;
            }

            const { currentUser } = user;
            const { firstMoveUserId } = match;
            const competitorSquareIndex = row + ',' + column;
            const competitorSquareType = currentUser.id === firstMoveUserId ? Config.SECOND_MOVE_SQUARE_TYPE : Config.FIRST_MOVE_SQUARE_TYPE;

            dispatch(match_UPDATE_STATE({
                isCurentUserTurn: true,
                squares: {
                    [competitorSquareIndex]: competitorSquareType,
                },
            }));
            break;
        }

        default:
            break;
    }
};


export default RoomHandler;
