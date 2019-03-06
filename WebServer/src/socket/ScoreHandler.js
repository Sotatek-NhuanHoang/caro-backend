import SocketServerEvents from 'caro-shared-resource/SocketServerEvents';
import { dispatch } from 'caro-store';
import { score_UPDATE_STATE } from 'caro-store/score';
import _ from 'lodash';


const ScoreHandler = (eventName, params) => {
    switch (eventName) {
        case SocketServerEvents.score_UPDATE: {
            const { scores: rawScores } = params;
            const scores = _.reduce(rawScores, (memo, item) => {
                const { userId, competitorUserId, score } = item;
                const scoreKey = userId + ',' + competitorUserId;
                memo[scoreKey] = score;
                return memo;
            }, {});
            dispatch(score_UPDATE_STATE({
                scores: {
                    ...scores,
                },
            }))
            break;
        }

        default:
            break;
    }
};


export default ScoreHandler;
