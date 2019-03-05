import io from 'socket.io-client';
import socketWildcard from 'socketio-wildcard';
import Config from 'caro-config';

import combineHandlers from './combineHandlers';
import RoomHandler from './RoomHandler';


const socket = io(Config.SOCKET_SERVER_URL);
socketWildcard(io.Manager)(socket);

const eventHandler = combineHandlers([
    RoomHandler,
]);


socket.on('connect', function () {
    socket.emit('hahaah')

    socket.on('*', ({ data }) => {
        const [ eventName, params ] = data;
        eventHandler(eventName, params);
    });
});

