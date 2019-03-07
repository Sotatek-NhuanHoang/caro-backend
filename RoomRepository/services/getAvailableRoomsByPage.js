const RepositoryName = require('caro-shared-resource/RepositoryName');
const RoomModel = require('caro-database/RoomModel');
const RoomStatus = require('caro-shared-resource/RoomStatus');


module.exports = function() {
    this.add(`repo:${RepositoryName.ROOM_REPOSITORY},service:getAvailableRoomsByPage`, async (msg, done) => {
        try {
            const { page, limit } = msg;

            const rooms = await RoomModel.find({ status: RoomStatus.WAITING, })
                .sort({ updated: -1, })
                .skip((page - 1) * limit)
                .limit(limit);
            
            done(null, {
                ok: 1,
                data: rooms,
            });
        } catch (error) {
            done({
                ok: 0,
                data: error.message,
            });
        }
    });
};
