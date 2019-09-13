import { put, takeEvery, call } from 'redux-saga/effects';
import { ActionType } from '../software/types';
import { devicesService } from '../../services/SoftwareService';
import { Actions } from '../software/actions';

function* setAllSoftware() {
  try {
    // FIXME: Temporarily use for dashboard
    const data = yield call(devicesService.getAllSoftware);
    const versionsTotal = Object.keys(data.signed.targets).length;

    yield put(Actions.setAllSoftwareDone({ versionsTotal }));
  } catch (e) {
    yield put(Actions.setAllSoftwareFailed());
  }
}

export default function* watchSoftwareSaga() {
  yield takeEvery(ActionType.SET_ALL_SOFTWARE_REQUEST, setAllSoftware);
}
