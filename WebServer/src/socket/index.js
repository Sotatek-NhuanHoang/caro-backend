import io from 'socket.io-client';
import socketWildcard from 'socketio-wildcard';
import Config from 'caro-config';
import _ from 'lodash';
import SocketClientEvents from 'caro-shared-resource/SocketClientEvents';

import combineHandlers from './combineHandlers';
import UserHandler from './UserHandler';
import RoomHandler from './RoomHandler';
import { getState } from 'caro-store';


const socket = io(Config.SOCKET_SERVER_URL);
socketWildcard(io.Manager)(socket);

const eventHandler = combineHandlers([
    UserHandler,
    RoomHandler,
]);


socket.on('connect', function () {
    const { user } = getState();
    const token = _.get(user, ['currentUser', 'token']);

    if (token) {
        socket.emit(SocketClientEvents.user_AUTHENTICATE, { token: token, });
    }

    socket.on('*', ({ data }) => {
        const [ eventName, params ] = data;
        eventHandler(eventName, params);

        if (process.env.NODE_ENV === 'development') {
            console.log('socket: ', eventName, params);
        }
    });
});


export default socket;
