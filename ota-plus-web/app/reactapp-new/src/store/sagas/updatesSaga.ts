import { put, takeEvery, call } from 'redux-saga/effects';
import { ActionType } from '../updates/types';
import { devicesService } from '../../services/UpdatesService';
import { Actions } from '../updates/actions';

function* setAllUpdates() {
  try {
    // FIXME: Temporarily use for dashboard
    const { total } = yield call(devicesService.getAllUpdates);

    yield put(Actions.setAllUpdatesDone({ total }));
  } catch (e) {
    yield put(Actions.setAllUpdatesFailed());
  }
}

export default function* watchUpdatesSaga() {
  yield takeEvery(ActionType.SET_ALL_UPDATES_REQUEST, setAllUpdates);
}
