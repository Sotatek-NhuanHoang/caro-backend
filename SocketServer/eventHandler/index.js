const combineHandlers = require('./combineHandlers');
const RoomHandler = require('.//RoomHandler');


const eventHandler = combineHandlers([
    RoomHandler,
]);


module.exports = eventHandler;
