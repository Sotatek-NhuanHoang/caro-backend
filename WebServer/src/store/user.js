import { handleActions, createAction } from 'redux-actions';
import { fromJS } from 'immutable';
import { createSelector } from 'reselect';
// import _ from 'lodash';
import UserApi from 'caro-api/UserApi';



/**
 * =====================================================
 * Default state
 * =====================================================
 */
const defaultState = {
    otherUsers: {},
    currentUser: {},
    isLogging: false,
    loginError: null,
};



/**
 * =====================================================
 * Actions
 * =====================================================
 */

export const user_UPDATE_STATE = createAction('user_UPDATE_STATE');

export const user_LOGIN = ({ accessToken, facebookId }) => async (dispatch) => {
    // Loading
    dispatch(user_UPDATE_STATE({ isLogging: true, loginError: null, }));

    try {
        const response = await UserApi.login({ accessToken: accessToken, facebookId: facebookId, });
        
        // Update current user
        dispatch(user_UPDATE_STATE({
            isLogging: false,
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




/**
 * =====================================================
 * Reducer
 * =====================================================
 */

export const reducer = handleActions({
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
