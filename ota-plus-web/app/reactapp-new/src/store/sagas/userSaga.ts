import { put, takeEvery, call } from 'redux-saga/effects';
import { IUserProfile, ActionType } from '../user/types';
import { userService } from '../../services/UserService';
import { Actions } from '../user/actions';

function* setUserProfile() {
  try {
    const data: IUserProfile = yield call(userService.getUserProfile);
    yield put(Actions.setUserProfileDone(data));
  } catch (e) {
    yield put(Actions.setUserProfileFailed());
  }
}

export default function* watchUserSaga() {
  yield takeEvery(ActionType.SET_USER_PROFILE_REQUEST, setUserProfile);
}
