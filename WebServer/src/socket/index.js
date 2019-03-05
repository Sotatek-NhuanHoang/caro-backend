import io from 'socket.io-client';
import socketWildcard from 'socketio-wildcard';
import Config from 'caro-config';
import _ from 'lodash';
import SocketClient from 'caro-shared-resource/SocketClient';

import combineHandlers from './combineHandlers';
import RoomHandler from './RoomHandler';
import { getState } from 'caro-store';


const socket = io(Config.SOCKET_SERVER_URL);
socketWildcard(io.Manager)(socket);

const eventHandler = combineHandlers([
    RoomHandler,
]);


socket.on('connect', function () {
    const { user } = getState();
    const token = _.get(user, ['currentUser', 'token']);

    if (token) {
        socket.emit(SocketClient.user_AUTHENTICATION, { token: token, });
    }

    socket.on('*', ({ data }) => {
        const [ eventName, params ] = data;
        eventHandler(eventName, params);
        console.log('socket: ', eventName, params);
    });
});


export default socket;
