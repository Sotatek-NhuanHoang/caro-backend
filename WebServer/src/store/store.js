import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


// reducers
import globalReducer from './user';
import roomReducer from './room';
import userReducer from './user';
import matchReducer from './match';
import scoreReducer from './score';


const reducers = combineReducers({
    global: globalReducer,
    room: roomReducer,
    user: persistReducer({
        key: 'user-xxx',
        storage: storage,
        whitelist: ['currentUser'],
    }, userReducer),
    match: matchReducer,
    score: scoreReducer,
});


const middleWares = [thunk];

if (process.env.NODE_ENV === 'development') {
    const { logger } = require(`redux-logger`);
    middleWares.push(logger);
}

const composeEnhancers =
    typeof window === 'object' &&
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && process.env.NODE_ENV) ?   
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) :
        (middleWares) => middleWares;

const enhancer = composeEnhancers (
  applyMiddleware(...middleWares),
);

const store = createStore(
    reducers,
    enhancer
);


export const persistor = persistStore(store);

export const dispatch = store.dispatch;
export const getState = store.getState;

export default store;
