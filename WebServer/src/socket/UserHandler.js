import SocketServerEvents from 'caro-shared-resource/SocketServerEvents';
import { dispatch } from 'caro-store';
import { user_UPDATE_STATE } from 'caro-store/user';


const ScoreHandler = (eventName, params) => {
    switch (eventName) {
        case SocketServerEvents.user_AUTHENTICATED: {
            dispatch(user_UPDATE_STATE({
                isSocketAuthenticated: true,
                isSocketAuthenticating: false,
            }));
            break;
        }

        case SocketServerEvents.user_UNAUTHENTICATED: {
            dispatch(user_UPDATE_STATE({
                isSocketAuthenticated: false,
                isSocketAuthenticating: false,
            }));
            break;
        }

        default:
            break;
    }
};


export default ScoreHandler;