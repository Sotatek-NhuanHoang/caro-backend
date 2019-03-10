const RepositoryName = require('caro-shared-resource/RepositoryName');
const MatchStatusDB = require('caro-database/MatchStatusDB');


module.exports = async function() {
    this.add(`repo:${RepositoryName.MATCH_REPOSITORY},service:updateMatchStatus`, async (msg, done) => {
        try {
            const { roomId, ...otherData } = msg;
            const { docs } = await MatchStatusDB.find({
                selector: {
                    roomId: roomId,
                },
            });
            const matchStatusDoc = docs[0];

            await MatchStatusDB.put({
                ...matchStatusDoc,
                ...otherData,
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
