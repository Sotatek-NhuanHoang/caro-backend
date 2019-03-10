const RepositoryName = require('caro-shared-resource/RepositoryName');

const RoomClient = require('./createClient')(RepositoryName.MATCH_REPOSITORY);

module.exports = RoomClient;
