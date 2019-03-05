import SocketServer from 'caro-shared-resource/SocketServer';
import { dispatch } from 'caro-store';
import { room_UPDATE_STATE } from 'caro-store/room';
import { user_UPDATE_STATE } from 'caro-store/user';


const RoomHandler = (eventName, params) => {
    switch (eventName) {
        case SocketServer.room_ADD_NEW:
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
        
        case SocketServer.room_JOIN:
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
            break;

        default:
            break;
    }
};


export default RoomHandler;
