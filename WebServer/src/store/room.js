import { handleActions, createAction } from 'redux-actions';
import { fromJS } from 'immutable';
import RoomApi from 'caro-api/RoomApi';
import { user_UPDATE_STATE } from './user';
import { createSelector } from 'reselect';
import _ from 'lodash';



/**
 * =====================================================
 * Default state
 * =====================================================
 */
const defaultState = {
    rooms: {},
    total: 0,
    page: 1,
    limit: 20,
    isGettingRooms: false,
    getRoomsError: null,
};



/**
 * =====================================================
 * Actions
 * =====================================================
 */

export const room_UPDATE_STATE = createAction('room_UPDATE_STATE');

export const room_GET_ROOMS = (shouldRefresh = false) => async (dispatch, getState) => {
    const { room } = getState();
    const page = shouldRefresh ? 1 : (room.page + 1);

    if (room.isGettingRooms) {
        return;
    }

    if (
        !shouldRefresh &&
        (page - 1) * room.limit > room.total
    ) {
        return;
    }

    // Set loading
    dispatch(room_UPDATE_STATE({
        isGettingRooms: true,
        getRoomsError: null,
    }));

    try {
        const response = await RoomApi.getRooms(page, room.limit);
        const { rooms: rawRooms, total, creatorUsers: rawCreatorUsers } = response;
        
        const creatorUsers = _.reduce(rawCreatorUsers, (memo, user) => {
            memo[user._id] = {
                id: user._id,
                ...user,
            };
            return memo;
        }, {});
        dispatch(user_UPDATE_STATE({
            otherUsers: {
                ...creatorUsers,
            },
        }));

        const rooms = _.reduce(rawRooms, (memo, room) => {
            memo[room._id] = {
                id: room._id,
                ...room,
            };
            return memo;
        }, {});
        dispatch(room_UPDATE_STATE({
            isGettingRooms: false,
            rooms: rooms,
            total: total,
            page: page,
        }));
    } catch (error) {
        dispatch(room_UPDATE_STATE({
            isGettingRooms: false,
            getRoomsError: error.message,
        }));
    }
};


/**
 * =====================================================
 * Reducer
 * =====================================================
 */

export const reducer = handleActions({
    room_UPDATE_STATE: (state, { payload }) => {
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

export const sortedRoomIdsSelector = createSelector(
    (room) => ({ rooms: room.rooms, }),
    ({ rooms }) => {
        const sortedRooms = _.sortBy(rooms, (room) => {
            return -room.updated;
        });
        const sortedRoomIds = _.map(sortedRooms, (room) => room.id);
        return sortedRoomIds;
    }
);

export const roomSelector = createSelector(
    (room, roomId) => ({ rooms: room.rooms, roomId: roomId, }),
    ({ rooms, roomId }) => {
        return rooms[roomId];
    }
);



export default reducer;
