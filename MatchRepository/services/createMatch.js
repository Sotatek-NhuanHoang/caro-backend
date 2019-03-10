const RepositoryName = require('caro-shared-resource/RepositoryName');
const MatchStatusDB = require('caro-database/MatchStatusDB');


module.exports = async function() {
    this.add(`repo:${RepositoryName.MATCH_REPOSITORY},service:createMatch`, async (msg, done) => {
        try {
            const { roomId } = msg;
            
            await MatchStatusDB.post({
                roomId: roomId,
                firstMoveUserId: null,
                winnerId: null,
                
                isCreatorUserTurn: false,
                isCompetitorUserTurn: false,

                creatorUserReadyNewGame: false,
                competitorUserReadyNewGame: false,
            });
            
            done(null, {
                ok: 1,
            });
        } catch (error) {
            done({
                ok: 0,
                data: error.message,
            });
        }
    });
};
