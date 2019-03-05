const RepositoryName = require('../RepositoryName');

const RoomClient = require('./createClient')(RepositoryName.ROOM_REPOSITORY);

module.exports = RoomClient;
