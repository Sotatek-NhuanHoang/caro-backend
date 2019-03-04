const RepositoryName = require('caro-shared-resource/RepositoryName');
const RoomModel = require('caro-database/RoomModel');
const RoomStatus = require('caro-shared-resource/RoomStatus');


module.exports = function() {
    this.add(`repo:${RepositoryName.ROOM_REPOSITORY},service:joinRoom`, async (msg, done) => {
        try {
            const { roomId, userId } = msg;
            await RoomModel.updateOne({ _id: roomId }, {
                $set: {
                    competitorUserId: userId,
                    status: RoomStatus.PLAYING,
                },
            });
            done(null);
        } catch (error) {
            done(error);
        }
    });
};
