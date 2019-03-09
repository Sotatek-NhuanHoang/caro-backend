import { handleActions, createAction } from 'redux-actions';
import { fromJS } from 'immutable';
import { createSelector } from 'reselect';
import { competitorUserIdSelector } from './room';
import ScoreDB from 'caro-database/ScoreDB';
// import _ from 'lodash';



/**
 * =====================================================
 * Default state
 * =====================================================
 */
const defaultState = {
    scores: {}, // [currentUserId,competitorUserId]: number
    sync: null,
};



/**
 * =====================================================
 * Actions
 * =====================================================
 */

export const score_UPDATE_STATE = createAction('score_UPDATE_STATE');

export const score_SUBSCRIBE = () => (dispatch, getState) => {
    const { room, user, score } = getState();
    const { sync } = score;
    const { currentUser } = user;
    const competitorUserId = competitorUserIdSelector(room, user);

    if (!competitorUserId) {
        return;
    }

    if (sync) {
        sync.cancel();
    }

    ScoreDB.changes({
        selector: {
            $or: [
                { userId: currentUser.id, competitorUserId: competitorUserId, },
                { userId: competitorUserId, competitorUserId: currentUser.id, },
            ],
        },
        live: true,
        include_docs: true,
    }).on('change', ({ doc }) => {
        if (doc._deleted) {
            doc.score = 0;
        }

        const { userId, competitorUserId, score: newScore } = doc;
        const scoreIndex = userId + ',' + competitorUserId;
        
        dispatch(score_UPDATE_STATE({
            scores: {
                [scoreIndex]: newScore,
            },
        }));
    });

    const newSync = ScoreDB.sync('http://localhost:5984/scoredb', {
        live: true,
        retry: true,
        push: true,
        pull: true,
        selector: {
            $or: [
                { userId: currentUser.id, competitorUserId: competitorUserId, },
                { userId: competitorUserId, competitorUserId: currentUser.id, },
            ],
        },
    });

    dispatch(score_UPDATE_STATE({
        sync: newSync,
    }));
};

export const score_INCREASE_SCORE = () => async (dispatch, getState) => {
    const { room, user } = getState();
    const { currentUser } = user;
    const competitorUserId = competitorUserIdSelector(room, user);

    try {
        const { docs } = await ScoreDB.find({
            selector: {
                userId: currentUser.id,
                competitorUserId: competitorUserId,
            },
        });
        const scoreDoc = docs[0];

        if (!scoreDoc) {
            await ScoreDB.post({
                userId: currentUser.id,
                competitorUserId: competitorUserId,
                score: 1,
            });
        } else {
            scoreDoc.score++;
            await ScoreDB.put(scoreDoc);
        }
    } catch (error) {
        console.log(error)
    }
};




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

export const scoreSelector = createSelector(
    (score, userId, competitorUserId) => ({ scores: score.scores, userId: userId, competitorUserId: competitorUserId }),
    ({ scores, userId, competitorUserId }) => {
        const scoreKey = userId + ',' + competitorUserId;
        return scores[scoreKey] || 0;
    }
);



export default reducer;
