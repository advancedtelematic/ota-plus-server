import { put, takeEvery } from 'redux-saga/effects';
import { UserProfile, actionTypes } from '../store/user/types';
import { userNetworking } from '../networking/UserNetworking';
import { Actions } from '../store/user/actions';

function* setUserProfile() {
  try {
    const data: UserProfile = yield userNetworking.getUserProfile();
    yield put(Actions.setUserProfileDone(data));
  } catch (e) {
    yield put(Actions.setUserProfileFailed());
  }
}

export default function* watchUserSaga() {
  yield takeEvery(actionTypes.SET_USER_PROFILE_REQUEST, setUserProfile);
}
