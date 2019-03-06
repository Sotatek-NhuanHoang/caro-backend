import SocketServerEvents from 'caro-shared-resource/SocketServerEvents';
import { dispatch, getState } from 'caro-store';
import { room_UPDATE_STATE, room_REMOVE, room_UPDATE_ONE } from 'caro-store/room';
import { user_UPDATE_STATE } from 'caro-store/user';
import { match_RESET } from 'caro-store/match';


const RoomHandler = (eventName, params) => {
    switch (eventName) {
        case SocketServerEvents.room_ADD_NEW: {
            dispatch(user_UPDATE_STATE({
                otherUsers: {
                    [params.creatorUser._id]: {
                        id: params.creatorUser._id,
                        ...params.creatorUser,
                    }
                }
            }));
            dispatch(room_UPDATE_STATE({
                rooms: {
                    [params.room._id]: {
                        id: params.room._id,
                        ...params.room
                    },
                },
            }));
            break;
        }
        
        case SocketServerEvents.room_REMOVE: {
            const { roomId } = params;
            dispatch(room_REMOVE({ roomId: roomId, }));
            break;
        }
        
        case SocketServerEvents.room_JOIN: {
            dispatch(user_UPDATE_STATE({
                otherUsers: {
                    [params.competitorUser._id]: {
                        id: params.competitorUser._id,
                        ...params.competitorUser,
                    }
                }
            }));
            dispatch(room_UPDATE_STATE({
                rooms: {
                    [params.room._id]: {
                        id: params.room._id,
                        ...params.room
                    },
                },
            }));
            dispatch(match_RESET({
                firstMoveUserId: params.room.creatorUserId,
                isCurentUserTurn: true,
            }));
            break;
        }

        case SocketServerEvents.room_EXIT: {
            const { roomId } = params;
            const { user, room } = getState();
            const { currentUser } = user;

            if (roomId !== room.currentRoomId) {
                return;
            }

            dispatch(room_UPDATE_STATE({
                rooms: {
                    [roomId]: {
                        creatorUserId: currentUser.id,
                        competitorUserId: null,
                    },
                },
            }));
            dispatch(match_RESET({
                firstMoveUserId: currentUser.id,
            }));
            break;
        }

        default:
            break;
    }
};


export default RoomHandler;
