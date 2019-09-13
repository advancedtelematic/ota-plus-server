import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

import { campaignsReducer } from './campaigns/reducers';
import { devicesReducer } from './devices/reducers';
import { softwareReducer } from './software/reducers';
import { updatesReducer } from './updates/reducers';
import { userReducer } from './user/reducers';

import { rootSaga } from './sagas/rootSaga';

import { Actions as CampaignsActions } from './campaigns/actions';
import { Actions as DevicesActions } from './devices/actions';
import { Actions as SoftwareActions } from './software/actions';
import { Actions as UpdatesActions } from './updates/actions';
import { Actions as UserActions } from './user/actions';

import { ICampaignsState } from './campaigns/types';
import { IDevicesState } from './devices/types';
import { ISoftwareState } from './software/types';
import { IUpdatesState } from './updates/types';
import { IUserState } from './user/types';

export {
  CampaignsActions,
  DevicesActions,
  SoftwareActions,
  UpdatesActions,
  UserActions
};

export type ICampaignsState = ICampaignsState;
export type IDevicesState = IDevicesState;
export type ISoftwareState = ISoftwareState;
export type IUpdatesState = IUpdatesState;
export type IUserState = IUserState;

const isDev = process.env.NODE_ENV === 'development';

const rootReducer = combineReducers({
  campaigns: campaignsReducer,
  devices: devicesReducer,
  software: softwareReducer,
  updates: updatesReducer,
  user: userReducer
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
