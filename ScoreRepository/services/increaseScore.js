const RepositoryName = require('caro-shared-resource/RepositoryName');
const ScoreModel = require('caro-database/ScoreModel');
const mongoose = require('caro-database');


module.exports = function() {
    this.add(`repo:${RepositoryName.SCORE_REPOSITORY},service:increaseScore`, async (msg, done) => {
        try {
            const { userId, competitorUserId } = msg;
            let score = await ScoreModel.findOne({
                userId: mongoose.Types.ObjectId(userId),
                competitorUserId: mongoose.Types.ObjectId(competitorUserId),
            });

            if (!score) {
                score = await ScoreModel.create({
                    userId: mongoose.Types.ObjectId(userId),
                    competitorUserId: mongoose.Types.ObjectId(competitorUserId),
                    score: 0,
                });
            }

            score.score++;
            await score.save();

            done(null, {
                ok: 1,
                data: { score: score },
            });
        } catch (error) {
            done({
                ok: 0,
                data: error.message,
            });
        }
    });
};
