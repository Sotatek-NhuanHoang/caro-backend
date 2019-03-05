const combineHandlers = (handlers = []) => {
    return (io, socket, eventName, params) => {
        for (let i = 0; i < handlers.length; i++) {
            setImmediate(() => {
                handlers[i](io, socket, eventName, params);
            });
        }
    };
};


module.exports = combineHandlers;
