const combineHandlers = (handlers = []) => {
    return (eventName, params) => {
        for (let i = 0; i < handlers.length; i++) {
            setImmediate(() => {
                handlers[i](eventName, params);
            });
        }
    };
};


export default combineHandlers;