const app = require('http').createServer(handler);
const io = require('socket.io')(app);
const socketMiddleware = require('socketio-wildcard');
const _ = require('lodash');

const combineHandlers = require('./combineHandlers');
const RoomHandler = require('./RoomHandler');
const UserHandler = require('./UserHandler');
const MatchHandler = require('./MatchHandler');

const RoomClient = require('caro-repository-client/RoomClient');
const UserClient = require('caro-repository-client/UserClient');
const SocketServerEvents = require('caro-shared-resource/SocketServerEvents');


function handler (req, res) {
    res.writeHead(200);
    res.end('OK');
}

app.listen(process.env.PORT || 8083);

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

    socket.on('disconnect', async () => {
        const { userId } = socket;

        if (!userId) {
            return;
        }

        try {
            const { rooms: joinedRooms } = await RoomClient.call('getJoinedRoomsByUserId', { userId: userId, });
 
            _.forEach(joinedRooms, async ({ _id: roomId }) => {
                try {
                    const { room, isDeleted } = await RoomClient.call('leaveRoom', {
                        roomId: roomId,
                        userId: userId,
                    });
                    
                    if (isDeleted) {
                        io.emit(SocketServerEvents.room_REMOVE, {
                            roomId: roomId,
                        });
                    } else {
                        const creatorUser = await UserClient.call('getUserById', { userId: room.creatorUserId, });
    
                        io.emit(SocketServerEvents.room_ADD_NEW, {
                            room: room,
                            creatorUser: creatorUser,
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        } catch (error) {
            console.log(error)
        }
    });
});


module.exports = io;
