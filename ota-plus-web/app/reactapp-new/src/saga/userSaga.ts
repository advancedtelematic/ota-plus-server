import { put, takeEvery } from 'redux-saga/effects';

import { UserProfile, SET_USER_PROFILE_REQUEST } from '../store/user/types';
import { setUserProfileDone, setUserProfileFailed } from '../store/user/actions';
import { userNetworking } from '../networking/UserNetworking';

function* setUserProfile() {
  try {
    const data: UserProfile = yield userNetworking.getUserProfile();
    yield put(setUserProfileDone(data));
  } catch (e) {
    yield put(setUserProfileFailed());
  }
}

export default function* watchUserSaga() {
  yield takeEvery(SET_USER_PROFILE_REQUEST, setUserProfile);
}
