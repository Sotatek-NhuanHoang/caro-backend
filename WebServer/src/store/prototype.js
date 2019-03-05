import { handleActions, createAction } from 'redux-actions';
import { fromJS } from 'immutable';
// import { createSelector } from 'reselect';
// import _ from 'lodash';



/**
 * =====================================================
 * Default state
 * =====================================================
 */
const defaultState = {
    rooms: {},

};



/**
 * =====================================================
 * Actions
 * =====================================================
 */

export const room_UPDATE_STATE = createAction('room_UPDATE_STATE');




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




export default reducer;
