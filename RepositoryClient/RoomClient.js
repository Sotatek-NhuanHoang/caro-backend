const RepositoryName = require('caro-shared-resource/RepositoryName');

const RoomClient = require('./createClient')(RepositoryName.ROOM_REPOSITORY);

module.exports = RoomClient;
