const RepositoryName = require('caro-shared-resource/RepositoryName');
const RoomModel = require('caro-database/RoomModel');
const RoomStatus = require('caro-shared-resource/RoomStatus');
const ServerError = require('caro-shared-resource/ServerError');


module.exports = function() {
    this.add(`repo:${RepositoryName.ROOM_REPOSITORY},service:joinRoom`, async (msg, done) => {
        try {
            const { roomId, userId } = msg;
            const room = await RoomModel.findOne({ _id: roomId, });

            if (room.competitorUserId) {
                done(new Error(ServerError.ROOM_FULL));
                return;
            }

            room.competitorUserId = userId;
            room.status = RoomStatus.PLAYING;
            await room.save();
            
            done(null);
        } catch (error) {
            done(error);
        }
    });
};
