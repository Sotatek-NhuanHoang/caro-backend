import SocketServer from 'caro-shared-resource/SocketServer';
import { dispatch } from 'caro-store';
import { room_UPDATE_STATE } from 'caro-store/room';


const RoomHandler = (eventName, params) => {
    switch (eventName) {
        case SocketServer.room_ADD_NEW:
            const room = params;
            dispatch(room_UPDATE_STATE({
                rooms: {
                    [room._id]: {
                        id: room._id,
                        ...room
                    },
                },
            }));
            break;
            
        default:
            break;
    }
};


export default RoomHandler;
