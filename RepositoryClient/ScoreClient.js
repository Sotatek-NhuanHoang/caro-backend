const RepositoryName = require('caro-shared-resource/RepositoryName');

const ScoreClient = require('./createClient')(RepositoryName.SCORE_REPOSITORY);

module.exports = ScoreClient;
