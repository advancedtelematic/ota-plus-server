import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

import { userReducer } from './user/reducers';
import { rootSaga } from './../saga/rootSaga';

const isDev = process.env.NODE_ENV === 'development';

const rootReducer = combineReducers({
  user: userReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

const sagaMiddleware = createSagaMiddleware();

export default function configureStore() {
  const middlewares = [];
  middlewares.push(sagaMiddleware);
  if (isDev) {
    middlewares.push(createLogger());
  }
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    serialize: true
  }) || compose();

  const middleWareEnhancer = applyMiddleware(...middlewares);

  const store = createStore(
    rootReducer,
    composeEnhancer(middleWareEnhancer),
  );
  sagaMiddleware.run(rootSaga);
  return store;
}
