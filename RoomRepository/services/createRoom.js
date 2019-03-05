const RepositoryName = require('caro-shared-resource/RepositoryName');
const RoomModel = require('caro-database/RoomModel');
const RoomStatus = require('caro-shared-resource/RoomStatus');


module.exports = function() {
    this.add(`repo:${RepositoryName.ROOM_REPOSITORY},service:createRoom`, async (msg, done) => {
        try {
            const { userId } = msg;
            const newRoom = await RoomModel.create({
                creatorUserId: userId,
                competitorUserId: null,
                status: RoomStatus.WAITING,
                firstMoveUser: userId,
                updated: Date.now(),
            });
            done(null, newRoom);
        } catch (error) {
            done(error);
        }
    });
};
