const RepositoryName = require('caro-shared-resource/RepositoryName');
const ScoreModel = require('caro-database/ScoreModel');


module.exports = function() {
    this.add(`repo:${RepositoryName.SCORE_REPOSITORY},service:getScore`, async (msg, done) => {
        try {
            const { userId, competitorUserId } = msg;
            let score = await ScoreModel.findOne({
                userId: userId,
                competitorUserId: competitorUserId,
            });

            if (!score) {
                score = await ScoreModel.create({
                    userId: userId,
                    competitorUserId: competitorUserId,
                    score: 0,
                });
            }

            done(null, score);
        } catch (error) {
            done(error);
        }
    });
};