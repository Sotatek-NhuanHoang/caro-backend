import { handleActions, createAction } from 'redux-actions';
import { fromJS } from 'immutable';
import { createSelector } from 'reselect';
import _ from 'lodash';
import socket from 'caro-socket';
import SocketClientEvents from 'caro-shared-resource/SocketClientEvents';
import UserApi from 'caro-api/UserApi';



/**
 * =====================================================
 * Default state
 * =====================================================
 */
const defaultState = {
    otherUsers: {},
    currentUser: {},

    isSocketAuthenticated: false,
    isSocketAuthenticating: false,

    isLogging: false,
    loginError: null,
};



/**
 * =====================================================
 * Actions
 * =====================================================
 */

export const user_RESET = createAction('user_RESET');

export const user_UPDATE_STATE = createAction('user_UPDATE_STATE');

export const user_LOGIN = ({ accessToken, facebookId }) => async (dispatch) => {
    // Loading
    dispatch(user_UPDATE_STATE({ isLogging: true, loginError: null, }));

    try {
        const response = await UserApi.login({ accessToken: accessToken, facebookId: facebookId, });
        
        // Update current user
        dispatch(user_UPDATE_STATE({
            isLogging: false,
            isSocketAuthenticating: true,
            currentUser: {
                id: response._id,
                facebookId: response.facebookId,
                username: response.username,
                avatar: response.avatar,
                token: response.token,
            },
        }));
    } catch (error) {
        dispatch(user_UPDATE_STATE({
            isLogging: false,
            loginError: error.message,
        }));
    }
};

export const user_SOCKET_AUTHENTICATE = () => (dispatch, getState) => {
    const { user } = getState();
    const token = _.get(user, ['currentUser', 'token']);

    dispatch(user_UPDATE_STATE({
        isSocketAuthenticated: false,
        isSocketAuthenticating: true,
    }));
    socket.emit(SocketClientEvents.user_AUTHENTICATE, { token: token, });
};

export const user_LOGOUT = () => (dispatch) => {
    dispatch(user_UPDATE_STATE({
        currentUser: {
            token: '',
        },
        isSocketAuthenticated: false,
    }));
    socket.emit(SocketClientEvents.user_LOGOUT);
};




/**
 * =====================================================
 * Reducer
 * =====================================================
 */

export const reducer = handleActions({
    user_RESET: (state, { payload }) => {
        return {
            ..._.cloneDeep(defaultState),
            ...payload,
        };
    },

    user_UPDATE_STATE: (state, { payload }) => {
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

export const otherUserSelector = createSelector(
    (user, userId) => ({ otherUsers: user.otherUsers, userId: userId, }),
    ({ otherUsers, userId }) => {
        return otherUsers[userId];
    }
);




export default reducer;
