import { all } from 'redux-saga/effects';
import watchCampaignsSaga from './campaignsSaga';
import watchDevicesSaga from './devicesSaga';
import watchSoftwareSaga from './softwareSaga';
import watchUpdatesSaga from './updatesSaga';
import watchUserSaga from './userSaga';

// Register all your watchers
export function* rootSaga() {
  yield all([
    watchCampaignsSaga(),
    watchDevicesSaga(),
    watchSoftwareSaga(),
    watchUpdatesSaga(),
    watchUserSaga(),
  ]);
}
