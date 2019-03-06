export const SquareType = {
    X: 'X',
    O: 'O',
};

const Config = {
    // API_SERVER_URL: 'https://caro-api.herokuapp.com/v1',
    // SOCKET_SERVER_URL: 'https://caro-socket.herokuapp.com',
    API_SERVER_URL: 'localhost:8080/v1',
    SOCKET_SERVER_URL: 'localhost:8084',
    CARO_BOARD_ROW: 30,
    CARO_BOARD_COLUMN: 48,
    FIRST_MOVE_SQUARE_TYPE: SquareType.X,
    SECOND_MOVE_SQUARE_TYPE: SquareType.O,
};


export default Config;
