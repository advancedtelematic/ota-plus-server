import { put, takeEvery, call, all } from 'redux-saga/effects';
import { ActionType } from '../devices/types';
import { devicesService } from '../../services/DevicesService';
import { Actions } from '../devices/actions';

function* setAllDevices() {
  try {
    const [
      { limit, offset, total, values },
      { total: totalUnconnected },
      { total: totalUngrouped },
      { total: deviceGroupsTotal }
    ] = yield all([
      call(devicesService.getAllDevices),
      call(devicesService.getAllUnconnectedDevices),
      call(devicesService.getAllUngroupedDevices),
      call(devicesService.getAllDeviceGroups)
    ]);
    yield put(Actions.setAllDevicesDone({
      limit,
      offset,
      total,
      totalUnconnected,
      totalUngrouped,
      deviceGroupsTotal,
      devices: values
    }));
  } catch (e) {
    yield put(Actions.setAllDevicesFailed());
  }
}

export default function* watchDevicesSaga() {
  yield takeEvery(ActionType.SET_ALL_DEVICES_REQUEST, setAllDevices);
}
