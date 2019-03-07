const RepositoryName = require('caro-shared-resource/RepositoryName');
const RoomModel = require('caro-database/RoomModel');
const RoomStatus = require('caro-shared-resource/RoomStatus');
const db = require('caro-database');


module.exports = function() {
    this.add(`repo:${RepositoryName.ROOM_REPOSITORY},service:leaveRoom`, async (msg, done) => {
        let session = null;

        try {
            const session = await db.startSession();
            session.startTransaction();

            const { roomId, userId } = msg;
            const room = await RoomModel.findOne({ _id: roomId, }).session(session);

            let isDeleted = false;

            if (room.competitorUserId) {
                if (room.creatorUserId.toString() === userId) {
                    room.creatorUserId = room.competitorUserId;
                }

                room.competitorUserId = null;
                room.status = RoomStatus.WAITING;

                await room.save({ session: session });
            } else {
                isDeleted = true;
                await RoomModel.deleteOne({ _id: roomId, }).session(session);
            }

            await session.commitTransaction();
            session.endSession();

            done(null, {
                ok: 1,
                data: {
                    room: room,
                    isDeleted: isDeleted,
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
