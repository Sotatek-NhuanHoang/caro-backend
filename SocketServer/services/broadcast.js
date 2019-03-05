const RepositoryName = require('caro-shared-resource/RepositoryName');
const io = require('caro-socket');


module.exports = function() {
    this.add(`repo:${RepositoryName.SOCKET_SERVER},service:broadcast`, async (msg, done) => {
        const { eventName, params } = msg;
        io.emit(eventName, params);
        done(null);
    });
};
