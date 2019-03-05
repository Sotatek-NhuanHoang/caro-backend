// Load env
require('dotenv').config();

const app = require('http').createServer(handler);
const io = require('socket.io')(app);
const socketMiddleware = require('socketio-wildcard');
const eventHandler = require('./eventHandler');


function handler (req, res) {
    res.writeHead(200);
    res.end('OK');
}

app.listen(process.env.SERVER_PORT);

io.use(socketMiddleware());

io.on('connection',  (socket) => {
    socket.on('*', ({ data }) => {
        const [ eventName, params ] = data;
        eventHandler(io, socket, eventName, params);
    });

    socket.emit('nhuan', 'meo meo')
});


