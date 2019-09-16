import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

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

  const middleWareEnhancer = applyMiddleware(...middlewares);

  const store = createStore(
    rootReducer,
    composeWithDevTools(middleWareEnhancer),
  );
  sagaMiddleware.run(rootSaga);
  return store;
}
