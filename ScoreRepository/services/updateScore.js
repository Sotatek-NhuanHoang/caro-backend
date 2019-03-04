const RepositoryName = require('caro-shared-resource/RepositoryName');
const ScoreModel = require('caro-database/ScoreModel');


module.exports = function() {
    this.add(`repo:${RepositoryName.SCORE_REPOSITORY},service:updateScore`, async (msg, done) => {
        try {
            const { userId, competitorUserId, score } = msg;
            await ScoreModel.updateOne({
                userId: userId,
                competitorUserId: competitorUserId,
            }, {
                $set: { score: score, },
            });
            done(null, newRoom);
        } catch (error) {
            done(error);
        }
    });
};
