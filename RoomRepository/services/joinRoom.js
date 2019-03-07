const RepositoryName = require('caro-shared-resource/RepositoryName');
const RoomModel = require('caro-database/RoomModel');
const RoomStatus = require('caro-shared-resource/RoomStatus');
const ServerError = require('caro-shared-resource/ServerError');
const db = require('caro-database');


module.exports = function() {
    this.add(`repo:${RepositoryName.ROOM_REPOSITORY},service:joinRoom`, async (msg, done) => {
        let session = null;

        try {
            const session = await db.startSession();
            session.startTransaction();

            const { roomId, userId } = msg;
            const room = await RoomModel.findOne({ _id: roomId, }).session(session);

            if (!room) {
                session.commitTransaction();
                done(null, {
                    ok: 0,
                    data: ServerError.ROOM_DELETED,
                });
                return;
            }

            if (room.competitorUserId) {
                session.commitTransaction();
                done(null, {
                    ok: 0,
                    data: ServerError.ROOM_FULL,
                });
                return;
            }

            room.competitorUserId = userId;
            room.status = RoomStatus.PLAYING;

            await room.save({ session: session });
            await session.commitTransaction();
            session.endSession();
            
            done(null, {
                ok: 1,
                data: room,
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
