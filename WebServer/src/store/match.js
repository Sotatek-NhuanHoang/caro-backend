import { handleActions, createAction } from 'redux-actions';
import { fromJS } from 'immutable';
import { createSelector } from 'reselect';
// import sleep from 'sleep-promise';
import _ from 'lodash';

import Config from 'caro-config';
import MatchStatusDB from 'caro-database/MatchStatusDB';
import MatchSquareDB from 'caro-database/MatchSquareDB';
import { showError } from 'caro-service/AlertService';
// import { score_INCREASE_SCORE } from './score';
import { competitorUserIdSelector } from './room';
import { getSync, getChanges } from 'caro-database';



/**
 * =====================================================
 * Default state
 * =====================================================
 */

const defaultState = {
    // MatchStatusDB
    firstMoveUserId: null,
    winnerId: null,
    isCreatorUserTurn: false,
    isCompetitorUserTurn: false,
    creatorUserReadyNewGame: false,
    competitorUserReadyNewGame: false,
    
    // MatchSquareDB
    squares: {},
    winningSquares: {},

    lastSquareIndex: '',

    statusSync: null,
    squareSync: null,
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

export const match_SUBSCRIBE = () => (dispatch, getState) => {
    const { room, match } = getState();
    const { statusSync, squareSync } = match;

    if (!room.currentRoomId) {
        return;
    }

    if (statusSync) {
        statusSync.cancel();
    }

    if (squareSync) {
        squareSync.cancel();
    }

    const selector = {
        roomId: room.currentRoomId,
    };

    const newStatusSync = getSync(MatchStatusDB, selector);
    getChanges(MatchStatusDB, selector, ({ doc }) => {
        if (doc._deleted) {
            return;
        }

        dispatch(match_UPDATE_STATE({
            firstMoveUserId: doc.firstMoveUserId,
            winnerId: doc.winnerId,
            
            isCreatorUserTurn: doc.isCreatorUserTurn,
            isCompetitorUserTurn: doc.isCompetitorUserTurn,

            creatorUserReadyNewGame: doc.creatorUserReadyNewGame,
            competitorUserReadyNewGame: doc.competitorUserReadyNewGame,
        }));
    });
    dispatch(match_UPDATE_STATE({
        statusSync: newStatusSync,
    }));

    const newSquareSync = getSync(MatchSquareDB, selector);
    getChanges(MatchSquareDB, selector, ({ doc }) => {
        if (doc._deleted) {
            return;
        }

        const { row, column, type, isWinningSquare } = doc;
        const squareIndex = row + ',' + column;

        dispatch(match_UPDATE_STATE({
            squares: {
                [squareIndex]: type,
            },
            winningSquares: {
                [squareIndex]: isWinningSquare,
            },
        }));
    });
    dispatch(match_UPDATE_STATE({
        squareSync: newSquareSync,
    }));
};


export const match_STROKE = (row, column) => async (dispatch, getState) => {
    const { room, match, user } = getState();
    const { squares, firstMoveUserId } = match;
    const isCurentUserTurn = isCurentUserTurnSelectror(room, user, match);

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

    dispatch(match_UPDATE_STATE({
        isCreatorUserTurn: false,
        isCompetitorUserTurn: false,
    }));

    const { currentUser } = user;
    const squareType = (currentUser.id === firstMoveUserId) ? Config.FIRST_MOVE_SQUARE_TYPE : Config.SECOND_MOVE_SQUARE_TYPE;

    try {
        const currentRoom = room.rooms[room.currentRoomId];

        const [{docs: matchStatusDocs}] = await Promise.all([
            MatchStatusDB.find({
                selector: {
                    roomId: room.currentRoomId,
                },
            }),
            MatchSquareDB.post({
                roomId: room.currentRoomId,
                row: row,
                column: column,
                type: squareType,
                isWinningSquare: false,
            }),
        ]);

        const matchStatusDoc = matchStatusDocs[0];

        if (currentUser.id === currentRoom.creatorUserId) {
            await MatchStatusDB.put({
                ...matchStatusDoc,
                isCreatorUserTurn: false,
                isCompetitorUserTurn: true,
            });
        } else {
            await MatchStatusDB.put({
                ...matchStatusDoc,
                isCreatorUserTurn: true,
                isCompetitorUserTurn: false,
            });
        }
    } catch (error) {
        console.log(error)
    }


    // const { match: nextMatch } = getState();
    // const winningSquares = checkWinningMatchFromIndex(nextMatch.squares, row, column);

    // if (winningSquares) {
    //     dispatch(score_INCREASE_SCORE());
    //     dispatch(match_UPDATE_STATE({
    //         winningSquares: winningSquares,
    //     }));

    //     await sleep(1500);
    //     dispatch(match_UPDATE_STATE({
    //         winnerId: currentUser.id,
    //     }));
    // }
};

export const match_READY_NEW_GAME = () => (dispatch, getState) => {
    
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

export const isCurentUserTurnSelectror = createSelector(
    (room, user, match) => ({
        room: room,
        user: user,
        match: match,
    }),
    ({ room, user, match }) => {
        const currentRoom = room.rooms[room.currentRoomId];

        if (!currentRoom) {
            return false;
        }

        if (currentRoom.creatorUserId === user.currentUser.id) {
            return match.isCreatorUserTurn;
        } else {
            return match.isCompetitorUserTurn;
        }
    }
);



export default reducer;
