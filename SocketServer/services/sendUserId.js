const RepositoryName = require('caro-shared-resource/RepositoryName');
const io = require('caro-socket');


module.exports = function() {
    this.add(`repo:${RepositoryName.SOCKET_SERVER},service:sendUserId`, async (msg, done) => {
        const { eventName, params, userId } = msg;
        io.to(userId).emit(eventName, params);
        done(null);
    });
};
