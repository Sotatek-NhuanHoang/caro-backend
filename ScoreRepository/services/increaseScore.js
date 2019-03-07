const RepositoryName = require('caro-shared-resource/RepositoryName');
const ScoreModel = require('caro-database/ScoreModel');
const db = require('caro-database');


module.exports = function() {
    this.add(`repo:${RepositoryName.SCORE_REPOSITORY},service:increaseScore`, async (msg, done) => {
        let session = null;
        
        try {
            const session = await db.startSession();
            session.startTransaction();

            const { userId, competitorUserId } = msg;
            let score = await ScoreModel.findOne({
                userId: db.Types.ObjectId(userId),
                competitorUserId: db.Types.ObjectId(competitorUserId),
            }).session(session);

            if (!score) {
                score = await ScoreModel.create({
                    userId: db.Types.ObjectId(userId),
                    competitorUserId: db.Types.ObjectId(competitorUserId),
                    score: 0,
                }, { session: session, });
            }

            score.score++;

            await score.save({ session: session, });
            await session.commitTransaction();
            session.endSession();

            done(null, {
                ok: 1,
                data: { score: score },
            });
        } catch (error) {
            if (session) {
                try {
                    await session.commitTransaction();
                    session.endSession();
                } catch (error) {
                    
                }
            }
            
            done({
                ok: 0,
                data: error.message,
            });
        }
    });
};
