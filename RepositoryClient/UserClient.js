const RepositoryName = require('caro-shared-resource/RepositoryName');

const UserClient = require('./createClient')(RepositoryName.USER_REPOSITORY);

module.exports = UserClient;
