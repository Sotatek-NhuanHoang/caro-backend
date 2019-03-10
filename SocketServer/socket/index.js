const app = require('http').createServer(handler);
const io = require('socket.io')(app);
const socketMiddleware = require('socketio-wildcard');

const combineHandlers = require('./combineHandlers');
const RoomHandler = require('./RoomHandler');
const UserHandler = require('./UserHandler');

const SocketClientEvents = require('caro-shared-resource/SocketClientEvents');


function handler (req, res) {
    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    });
    res.end('OK');
}

app.listen(process.env.PORT || 8083);

const eventHandler = combineHandlers([
    RoomHandler,
    UserHandler,
]);

io.use(socketMiddleware());

io.on('connection',  (socket) => {
    socket.on('*', ({ data }) => {
        const [ eventName, params ] = data;

        if (eventName === 'disconnect') {
            return;
        }

        eventHandler(io, socket, eventName, params);
    });

    socket.on('disconnect', async () => {
        eventHandler(io, socket, SocketClientEvents.user_LOGOUT);
    });
});


module.exports = io;
