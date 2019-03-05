const RoomClient = require('caro-repository-client/RoomClient');


const RoomControllers = {
    createRoom: async (req, reply) => {
        try {
            const newRoom = await RoomClient.call('createRoom', { userId: req.user._id });
            reply.status(200).send(newRoom);
        } catch (error) {
            reply.status(500).send({ message: error.message });
        }
    },
};


module.exports = RoomControllers;
