import { call, put, takeEvery } from 'redux-saga/effects';
import { FeedData, actionTypes, FeedNetworkingData } from '../feed/types';
import { feedService } from '../../services/FeedService';
import { Actions } from '../feed/actions';
import uuid from '../../utils/uuid';

function mutateData(data: FeedNetworkingData[]): FeedData[] {
  return data.map(({ createdAt, resource, _type } : FeedNetworkingData) =>
    ({ createdAt, _type, id: uuid(), ...resource })
  );
}

function* getFeedData(action: Extract<Actions, { type: actionTypes.GET_FEED_REQUEST }>) {
  console.log('calling feed');
  try {
    const data: FeedNetworkingData[] = yield call(feedService.getFeedData, action.payload);
    yield put(Actions.setFeedData(mutateData(data)));
  } catch (e) {
    yield put(Actions.setFeedDataFailed());
  }
}

export default function* watchFeedSaga() {
  yield takeEvery(actionTypes.GET_FEED_REQUEST, getFeedData);
}
