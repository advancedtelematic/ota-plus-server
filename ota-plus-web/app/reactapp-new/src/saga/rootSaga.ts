import { all } from 'redux-saga/effects';
import watchUserSaga from './userSaga';

// Register all your watchers
export function* rootSaga() {
  yield all([
    watchUserSaga(),
  ]);
}
