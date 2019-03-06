const RepositoryName = require('caro-shared-resource/RepositoryName');
const RoomModel = require('caro-database/RoomModel');
const RoomStatus = require('caro-shared-resource/RoomStatus');


module.exports = function() {
    this.add(`repo:${RepositoryName.ROOM_REPOSITORY},service:getTotalAvailableRooms`, async (msg, done) => {
        try {
            // const { page, limit } = msg;

            // const totalAvailablekRooms = await RoomModel.count({ status: RoomStatus.WAITING, });
            
            done(null, { total: 0, });
        } catch (error) {
            done(error);
        }
    });
};
