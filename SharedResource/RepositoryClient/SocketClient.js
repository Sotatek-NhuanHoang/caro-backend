const RepositoryName = require('../RepositoryName');

const SocketClient = require('./createClient')(RepositoryName.SOCKET_SERVER);

module.exports = SocketClient;
