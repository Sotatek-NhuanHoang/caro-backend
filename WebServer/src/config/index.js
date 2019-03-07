export const SquareType = {
    X: 'X',
    O: 'O',
};

const Config = {
    API_SERVER_URL: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8080' : 'https://caro-api.herokuapp.com',
    API_SERVER_VERSION: 'v1',
    SOCKET_SERVER_URL: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8083' : 'https://caro-socket.herokuapp.com',
    CARO_BOARD_ROW: 30,
    CARO_BOARD_COLUMN: 48,
    FIRST_MOVE_SQUARE_TYPE: SquareType.X,
    SECOND_MOVE_SQUARE_TYPE: SquareType.O,
};


export default Config;
