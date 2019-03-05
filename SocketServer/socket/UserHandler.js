const jwt = require('jsonwebtoken');
const SocketClientEvents = require('caro-shared-resource/SocketClientEvents');
const UserClient = require('caro-repository-client/UserClient');


const UserHandler = (io, socket, eventName, params) => {
    switch (eventName) {
        case SocketClientEvents.user_AUTHENTICATION: {
            const { token } = params;

            jwt.verify(token, process.env.SERVER_SECRET_KEY, { algorithms: [process.env.SERVER_SECRET_ALGORITHM], }, async (err, decoded) => {
                if (err) {
                    return;
                }
                
                const { userId } = decoded;
                const user = await UserClient.call('getUserById', { userId: userId, });
                
                if (!user) {
                    return;
                }

                socket.join(userId);
            });
            break;
        }
    }
};


module.exports = UserHandler;
