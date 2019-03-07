const RepositoryName = require('caro-shared-resource/RepositoryName');

const SocketClient = require('./createClient')(RepositoryName.SOCKET_SERVER);

module.exports = SocketClient;
