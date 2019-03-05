export const SquareType = {
    X: 'X',
    O: 'O',
};

const Config = {
    API_SERVER_URL: 'http://localhost:8080/v1',
    SOCKET_SERVER_URL: 'http://localhost:8081',
    CARO_BOARD_ROW: 30,
    CARO_BOARD_COLUMN: 48,
    FIRST_MOVE_SQUARE_TYPE: SquareType.X,
    SECOND_MOVE_SQUARE_TYPE: SquareType.O,
};


export default Config;
