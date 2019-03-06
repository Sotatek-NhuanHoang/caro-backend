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
    scores: {}, // [currentUserId,competitorUserId]: number
};



/**
 * =====================================================
 * Actions
 * =====================================================
 */

export const score_UPDATE_STATE = createAction('score_UPDATE_STATE');




/**
 * =====================================================
 * Reducer
 * =====================================================
 */

export const reducer = handleActions({
    score_UPDATE_STATE: (state, { payload }) => {
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
