const RepositoryName = require('caro-shared-resource/RepositoryName');
const RoomModel = require('caro-database/RoomModel');
const RoomStatus = require('caro-shared-resource/RoomStatus');


module.exports = function() {
    this.add(`repo:${RepositoryName.ROOM_REPOSITORY},service:leaveRoom`, async (msg, done) => {
        try {
            const { roomId, userId } = msg;
            const room = await RoomModel.findOne({ _id: roomId, });

            let isDeleted = false;

            if (room.competitorUserId) {
                if (room.creatorUserId.toString() === userId) {
                    room.creatorUserId = room.competitorUserId;
                }

                room.competitorUserId = null;
                room.status = RoomStatus.WAITING;

                await room.save();
            } else {
                isDeleted = true;
                await RoomModel.deleteOne({ _id: roomId, });
            }

            done(null, {
                room: room,
                isDeleted: isDeleted,
            });
        } catch (error) {
            done(error);
        }
    });
};
