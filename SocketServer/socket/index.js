const app = require('http').createServer(handler);
const io = require('socket.io')(app);
const socketMiddleware = require('socketio-wildcard');

const combineHandlers = require('./combineHandlers');
const RoomHandler = require('./RoomHandler');
const UserHandler = require('./UserHandler');


function handler (req, res) {
    res.writeHead(200);
    res.end('OK');
}

app.listen(process.env.SERVER_PORT);

const eventHandler = combineHandlers([
    RoomHandler,
    UserHandler,
]);

io.use(socketMiddleware());

io.on('connection',  (socket) => {
    socket.on('*', ({ data }) => {
        const [ eventName, params ] = data;
        eventHandler(io, socket, eventName, params);
    });
});


module.exports = io;
