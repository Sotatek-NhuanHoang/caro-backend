const RepositoryName = require('caro-shared-resource/RepositoryName');
const RoomModel = require('caro-database/RoomModel');
const RoomStatus = require('caro-shared-resource/RoomStatus');


module.exports = function() {
    this.add(`repo:${RepositoryName.ROOM_REPOSITORY},service:leaveRoom`, async (msg, done) => {
        try {
            const { roomId, userId } = msg;
            const room = await RoomModel.findOne({ _id: roomId, });

            if (room.competitorUserId) {
                if (room.creatorUserId === userId) {
                    room.creatorUserId = room.competitorUserId;
                }

                room.competitorUserId = null;
                room.status = RoomStatus.WAITING;

                await room.save();
            } else {
                await RoomModel.deleteOne({ _id: roomId, });
            }

            done(null);
        } catch (error) {
            done(error);
        }
    });
};
