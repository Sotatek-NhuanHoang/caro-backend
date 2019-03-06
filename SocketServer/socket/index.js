const app = require('http').createServer(handler);
const io = require('socket.io')(app);
const socketMiddleware = require('socketio-wildcard');

const combineHandlers = require('./combineHandlers');
const RoomHandler = require('./RoomHandler');
const UserHandler = require('./UserHandler');
const MatchHandler = require('./MatchHandler');


function handler (req, res) {
    res.writeHead(200);
    res.end('OK');
}

app.listen(process.env.SERVER_PORT);

const eventHandler = combineHandlers([
    RoomHandler,
    UserHandler,
    MatchHandler,
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

    socket.on('disconnect', function () {
        const { userId } = socket;

        if (!userId) {
            return;
        }
    });
});


module.exports = io;
