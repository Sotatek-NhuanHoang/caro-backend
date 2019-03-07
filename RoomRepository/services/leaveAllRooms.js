const RepositoryName = require('caro-shared-resource/RepositoryName');
const RoomModel = require('caro-database/RoomModel');
const RoomStatus = require('caro-shared-resource/RoomStatus');
const db = require('caro-database');
const _ = require('lodash');
const Promise = require('bluebird');


module.exports = function() {
    this.add(`repo:${RepositoryName.ROOM_REPOSITORY},service:leaveAllRooms`, async (msg, done) => {
        let session = null;

        try {
            const session = await db.startSession();
            session.startTransaction();

            const availableRooms = [];
            const deletedRooms = [];

            const { userId } = msg;
            const joinedRooms = await RoomModel.find({
                $or: [
                    { creatorUserId: db.Types.ObjectId(userId), },
                    { competitorUserId: db.Types.ObjectId(userId), },
                ],
            }, null, { session: session, });

            await Promise.all(_.map(joinedRooms, async (room) => {
                if (room.competitorUserId) {
                    if (room.creatorUserId.toString() === userId) {
                        room.creatorUserId = room.competitorUserId;
                    }
    
                    room.competitorUserId = null;
                    room.status = RoomStatus.WAITING;
                    
                    availableRooms.push(room);
                    await room.save({ session: session });
                } else {
                    deletedRooms.push(room);
                    await RoomModel.deleteOne({ _id: room._id, }).session(session);
                }
            }));

            await session.commitTransaction();
            session.endSession();

            done(null, {
                ok: 1,
                data: {
                    availableRooms: availableRooms,
                    deletedRooms: deletedRooms,
                },
            });
        } catch (error) {
            if (session) {
                try {
                    await session.commitTransaction();
                    session.endSession();
                } catch (error) {
                    
                }
            }

            done({
                ok: 0,
                data: error.message,
            });
        }
    });
};
