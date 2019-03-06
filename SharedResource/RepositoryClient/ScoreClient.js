const RepositoryName = require('../RepositoryName');

const ScoreClient = require('./createClient')(RepositoryName.SCORE_REPOSITORY);

module.exports = ScoreClient;
