import { handleActions, createAction } from 'redux-actions';
import { fromJS } from 'immutable';
import { createSelector } from 'reselect';
import Config from 'caro-config';
import _ from 'lodash';
import SocketClientEvents from 'caro-shared-resource/SocketClientEvents';
import socket from 'caro-socket';
import { showError } from 'caro-service/AlertService';
import sleep from 'sleep-promise';



/**
 * =====================================================
 * Default state
 * =====================================================
 */

const defaultState = {
    firstMoveUserId: null,
    winnerId: null,
    isCurentUserTurn: false,
    squares: {},
    lastSquareIndex: '',
    winningSquares: {},

    currentUserReadyNewGame: false,
    competitorUserReadyNewGame: false,
};


const checkHorizontal = (row, column, squares, rootSquareType, boardRow, boardColumn) => {
    const winningSquares = {
        [row + ',' + column]: true,
    };

    // Count left side
    for (let i = (column - 1); i >= 0; i--) {
        const squareIndex = row + ',' + i;
        const squareType = squares[squareIndex];

        if (squareType === rootSquareType) {
            winningSquares[squareIndex] = true;
        } else {
            break;
        }
    }

    // Count right side
    for (let i = (column + 1); i < boardColumn; i++) {
        const squareIndex = row + ',' + i;
        const squareType = squares[squareIndex];

        if (squareType === rootSquareType) {
            winningSquares[squareIndex] = true;
        } else {
            break;
        }
    }

    if (_.keys(winningSquares).length >= 5) {
        return winningSquares;
    } else {
        return null;
    }
};

const checkVertical = (row, column, squares, rootSquareType, boardRow) => {
    const winningSquares = {
        [row + ',' + column]: true,
    };

    // Count top
    for (let i = (row - 1); i >= 0; i--) {
        const squareIndex = i + ',' + column;
        const squareType = squares[squareIndex];

        if (squareType === rootSquareType) {
            winningSquares[squareIndex] = true;
        } else {
            break;
        }
    }

    // Count bottom
    for (let i = (row + 1); i < boardRow; i++) {
        const squareIndex = i + ',' + column;
        const squareType = squares[squareIndex];

        if (squareType === rootSquareType) {
            winningSquares[squareIndex] = true;
        } else {
            break;
        }
    }

    if (_.keys(winningSquares).length >= 5) {
        return winningSquares;
    } else {
        return null;
    }
};

const checkLeftBias = (row, column, squares, rootSquareType, boardRow, boardColumn) => {
    const winningSquares = {
        [row + ',' + column]: true,
    };

    // Count top
    for (let x = (row - 1), y = (column - 1) ; x >= 0 && y >= 0; x--, y--) {
        const squareIndex = x + ',' + y;
        const squareType = squares[squareIndex];

        if (squareType === rootSquareType) {
            winningSquares[squareIndex] = true;
        } else {
            break;
        }
    }

    // Count bottom
    for (let x = (row + 1), y = (column + 1) ; x < boardRow && y < boardColumn; x++, y++) {
        const squareIndex = x + ',' + y;
        const squareType = squares[squareIndex];

        if (squareType === rootSquareType) {
            winningSquares[squareIndex] = true;
        } else {
            break;
        }
    }

    if (_.keys(winningSquares).length >= 5) {
        return winningSquares;
    } else {
        return null;
    }
};

const checkRightBias = (row, column, squares, rootSquareType, boardRow, boardColumn) => {
    const winningSquares = {
        [row + ',' + column]: true,
    };

    // Count top
    for (let x = (row - 1), y = (column + 1) ; x >= 0 && y < boardColumn; x--, y++) {
        const squareIndex = x + ',' + y;
        const squareType = squares[squareIndex];

        if (squareType === rootSquareType) {
            winningSquares[squareIndex] = true;
        } else {
            break;
        }
    }

    // Count bottom
    for (let x = (row + 1), y = (column - 1) ; x < boardRow && y >= 0; x++, y--) {
        const squareIndex = x + ',' + y;
        const squareType = squares[squareIndex];

        if (squareType === rootSquareType) {
            winningSquares[squareIndex] = true;
        } else {
            break;
        }
    }

    if (_.keys(winningSquares).length >= 5) {
        return winningSquares;
    } else {
        return null;
    }
};


export const checkWinningMatchFromIndex = (squares, row, column) => {
    const squareIndex = row + ',' + column;
    const squareType = squares[squareIndex];
    const checkers = [
        checkHorizontal,
        checkVertical,
        checkLeftBias,
        checkRightBias
    ];

    for (let i = 0; i < checkers.length; i++) {
        const winningSquares = checkers[i](row, column, squares, squareType, Config.CARO_BOARD_ROW, Config.CARO_BOARD_COLUMN);
        
        if (winningSquares) {
            return winningSquares;
        }
    }
};


/**
 * =====================================================
 * Actions
 * =====================================================
 */

export const match_RESET = createAction('match_RESET');

export const match_UPDATE_STATE = createAction('match_UPDATE_STATE');

export const match_STROKE = (row, column) => async (dispatch, getState) => {
    const { match, user, room } = getState();
    const { isCurentUserTurn, squares, firstMoveUserId } = match;

    if (!firstMoveUserId) {
        showError('Waiting user ...');
        return;
    }

    if (!isCurentUserTurn) {
        showError('Not your turn!');
        return;
    }

    const squareIndex = row + ',' + column;

    if (squares[squareIndex]) {
        return;
    }

    const { currentUser } = user;
    const squareType = (currentUser.id === firstMoveUserId) ? Config.FIRST_MOVE_SQUARE_TYPE : Config.SECOND_MOVE_SQUARE_TYPE;
    const currentRoom = room.rooms[room.currentRoomId];
    const competitorUserId = currentRoom.creatorUserId === currentUser.id ? currentRoom.competitorUserId : currentRoom.creatorUserId;

    dispatch(match_UPDATE_STATE({
        isCurentUserTurn: false,
        squares: {
            [squareIndex]: squareType,
        },
        lastSquareIndex: squareIndex,
    }));

    socket.emit(SocketClientEvents.match_STROKE, {
        roomId: currentRoom.id,
        row: row,
        column: column,
        competitorUserId: competitorUserId,
        userId: currentUser.id,
    });

    const { match: nextMatch } = getState();
    const winningSquares = checkWinningMatchFromIndex(nextMatch.squares, row, column);

    if (winningSquares) {
        socket.emit(SocketClientEvents.match_WIN, {
            userId: currentUser.id,
            competitorUserId: competitorUserId,
        });

        await sleep(2000);
        dispatch(match_UPDATE_STATE({
            winningSquares: winningSquares,
            winnerId: currentUser.id,
        }));
    }
};

export const match_READY_NEW_GAME = () => (dispatch, getState) => {
    const { user, room, match } = getState();
    const { currentUser } = user;

    if (!match.winnerId) {
        return;
    }

    const currentRoom = room.rooms[room.currentRoomId];
    const competitorUserId = (currentRoom.creatorUserId === currentUser.id) ? currentRoom.competitorUserId : currentRoom.creatorUserId;

    if (!currentRoom.competitorUserId) {
        return;
    }
    
    dispatch(match_UPDATE_STATE({
        currentUserReadyNewGame: true,
    }));
    
    socket.emit(SocketClientEvents.match_READY_NEW_GAME, {
        roomId: currentRoom.id,
        competitorUserId: competitorUserId,
    });
};

export const match_REMATCH = () => (dispatch, getState) => {
    const { match, user, room } = getState();
    const { currentUser } = user;
    const { winnerId } = match;
    const currentRoom = room.rooms[room.currentRoomId];

    const isCurentUserTurn = (currentUser.id !== winnerId); // Loser go first
    const competitorUserId = (currentRoom.creatorUserId === currentUser.id) ? currentRoom.competitorUserId : currentRoom.creatorUserId;

    dispatch(match_RESET({
        isCurentUserTurn: isCurentUserTurn,
        firstMoveUserId: isCurentUserTurn ? currentUser.id : competitorUserId,
    }));
};



/**
 * =====================================================
 * Reducer
 * =====================================================
 */

export const reducer = handleActions({
    match_RESET: (state, { payload }) => {
        return {
            ..._.cloneDeep(defaultState),
            ...payload,
        };
    },

    match_UPDATE_STATE: (state, { payload }) => {
        return fromJS(state)
            .mergeDeep(payload)
            .toJS();
    },
}, defaultState);



/**
 * =====================================================
 * Selectors
 * =====================================================
 */

export const squareSelector = createSelector(
    (match, row, column) => ({ squares: match.squares, row: row, column: column}),
    ({ squares, row, column }) => {
        const squareIndex = row + ',' + column;
        return squares[squareIndex];
    }
);

export const winningSquareSelector = createSelector(
    (match, row, column) => ({ winningSquares: match.winningSquares, row: row, column: column}),
    ({ winningSquares, row, column }) => {
        const squareIndex = row + ',' + column;
        return winningSquares[squareIndex] || false;
    }
);



export default reducer;
