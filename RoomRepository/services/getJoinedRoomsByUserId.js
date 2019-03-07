const RepositoryName = require('caro-shared-resource/RepositoryName');
const RoomModel = require('caro-database/RoomModel');
const mongoose = require('caro-database');


module.exports = function() {
    this.add(`repo:${RepositoryName.ROOM_REPOSITORY},service:getJoinedRoomsByUserId`, async (msg, done) => {
        try {
            const { userId } = msg;
            const joinedRooms = await RoomModel.find({
                $or: [
                    { creatorUserId: mongoose.Types.ObjectId(userId), },
                    { competitorUserId: mongoose.Types.ObjectId(userId), },
                ],
            });

            done(null, {
                ok: 1,
                data: { rooms: joinedRooms, },
            });
        } catch (error) {
            done({
                ok: 0,
                data: error.message,
            });
        }
    });
};
