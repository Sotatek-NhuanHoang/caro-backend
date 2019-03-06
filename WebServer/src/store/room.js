import { handleActions, createAction } from 'redux-actions';
import { fromJS } from 'immutable';
import RoomApi from 'caro-api/RoomApi';
import { user_UPDATE_STATE } from './user';
import { match_RESET } from './match';
import { createSelector } from 'reselect';
import _ from 'lodash';
import RoomStatus from 'caro-shared-resource/RoomStatus';
import socket from 'caro-socket';
import SocketClientEvents from 'caro-shared-resource/SocketClientEvents';



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

    creatingRoom: false,
    createRoomError: null,

    currentRoomId: null,
};



/**
 * =====================================================
 * Actions
 * =====================================================
 */

export const room_UPDATE_STATE = createAction('room_UPDATE_STATE');

export const room_UPDATE_ONE = createAction('room_UPDATE_ONE');

export const room_REMOVE = createAction('room_REMOVE');

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


export const room_NEW_ROOM = () => async (dispatch) => {
    dispatch(room_UPDATE_STATE({
        creatingRoom: true,
        createRoomError: null,
    }));

    try {
       const newRoom = await RoomApi.createRoom();

       dispatch(room_UPDATE_STATE({
            rooms: {
                [newRoom._id]: {
                    id: newRoom._id,
                    ...newRoom
                }
            },
            currentRoomId: newRoom._id,
            creatingRoom: false,
        }));
    } catch (error) {
        dispatch(room_UPDATE_STATE({
            creatingRoom: false,
            createRoomError: error.message,
        }));
    }
};

export const room_JOIN_ROOM = (roomId) => async (dispatch) => {
    dispatch(room_UPDATE_STATE({
        creatingRoom: true,
        createRoomError: null,
    }));

    try {
        const response = await RoomApi.joinRoom(roomId);
        const { room: joinedRoom, creatorUser } = response;

        dispatch(user_UPDATE_STATE({
            otherUsers: {
                [creatorUser._id]: {
                    id: creatorUser._id,
                    ...creatorUser,
                }
            }
        }));
        dispatch(room_UPDATE_STATE({
            rooms: {
                [joinedRoom._id]: {
                    id: joinedRoom._id,
                    ...joinedRoom
                }
            },
            currentRoomId: joinedRoom._id,
            creatingRoom: false,
        }));
        dispatch(match_RESET({
            firstMoveUserId: creatorUser._id,
        }));
    } catch (error) {
        dispatch(room_UPDATE_STATE({
            creatingRoom: false,
            createRoomError: error.message,
        }));
    }
};

export const room_OUT_ROOM = () => (dispatch, getState) => {
    const { room, user } = getState();
    const { currentRoomId } = room;
    const { currentUser } = user;


    if (!currentRoomId) {
        return;
    }

    const currentRoom = room.rooms[currentRoomId];
    const competitorUserId = currentRoom.creatorUserId === currentUser.id ? currentRoom.competitorUserId : currentRoom.creatorUserId;

    dispatch(room_UPDATE_STATE({
        currentRoomId: null,
    }));
    dispatch(match_RESET());

    socket.emit(SocketClientEvents.room_EXIT, {
        roomId: currentRoomId,
        userId: currentUser.id,
        competitorUserId: competitorUserId,
    });
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

    room_REMOVE: (state, { payload }) => {
        const { roomId } = payload;
        return fromJS(state)
            .removeIn(['rooms', roomId])
            .toJS();
    }
}, defaultState);



/**
 * =====================================================
 * Selectors
 * =====================================================
 */

export const sortedRoomIdsSelector = createSelector(
    (room) => ({ rooms: room.rooms, }),
    ({ rooms }) => {
        const availableRooms = _.filter(rooms, (room) => {
            return (room.status === RoomStatus.WAITING);
        });
        const sortedRooms = _.sortBy(availableRooms, (room) => {
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
