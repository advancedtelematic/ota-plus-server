import { put, takeEvery, call, all } from 'redux-saga/effects';
import { ActionType } from '../campaigns/types';
import { campaignsService } from '../../services/CampaignsService';
import { Actions } from '../campaigns/actions';

function* setAllCampaigns() {
  try {
    const [{ total }, { total: totalWithError }] = yield all([
      call(campaignsService.getAllCampaigns),
      call(campaignsService.getAllCampaignsWithError)
    ]);
    yield put(Actions.setAllCampaignsDone({ total, totalWithError }));
  } catch (e) {
    yield put(Actions.setAllCampaignsFailed());
  }
}

export default function* watchCampaignsSaga() {
  yield takeEvery(ActionType.SET_ALL_CAMPAIGNS_REQUEST, setAllCampaigns);
}
