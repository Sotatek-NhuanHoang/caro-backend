const RepositoryName = require('../RepositoryName');

const UserClient = require('./createClient')(RepositoryName.USER_REPOSITORY);

module.exports = UserClient;
