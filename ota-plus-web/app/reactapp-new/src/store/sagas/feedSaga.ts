import { call, put, takeEvery } from 'redux-saga/effects';
import i18n from 'i18next';
import { FeedData, ActionTypes, FeedNetworkingData } from '../feed/types';
import { feedService } from '../../services/FeedService';
import { Actions } from '../feed/actions';

function mutateData(data: FeedNetworkingData[]): FeedData[] {
  const mutatedData: FeedData[] = [];
  data.forEach(({ createdAt, resource, _type }: FeedNetworkingData) => {
    switch (_type) {
      case 'campaign': {
        const { id, name } = resource;
        mutatedData.push({ id, createdAt, name, type: _type, supplementaryText: '' });
        break;
      }
      case 'device': {
        const { deviceId, deviceName, uuid } = resource;
        mutatedData.push({
          uuid,
          createdAt,
          type: _type,
          name: deviceName,
          supplementaryText: `${i18n.t('dashboard.recentlycreated.id')}: ${deviceId}`
        });
        break;
      }
      case 'device_group': {
        const { id, groupName } = resource;
        mutatedData.push({ id, createdAt, type: _type, name: groupName, supplementaryText: '' });
        break;
      }
      case 'software': {
        const { name, hardwareIds } = resource;
        mutatedData.push({
          createdAt,
          name,
          id: `${name}-${createdAt}`,
          type: _type,
          supplementaryText: hardwareIds.length > 1
            ? i18n.t('dashboard.recentlycreated.ecu-types', { count: hardwareIds.length })
            : hardwareIds[0]
        });
        break;
      }
      case 'update': {
        const { uuid, name, description } = resource;
        mutatedData.push({ uuid, createdAt, name, type: _type, supplementaryText: description });
        break;
      }
      default: {
        break;
      }
    }
  });
  return mutatedData;
}

function* getFeedData(action: Extract<Actions, { type: ActionTypes.GET_FEED_REQUEST }>) {
  try {
    const data: FeedNetworkingData[] = yield call(feedService.getFeedData, action.payload);
    yield put(Actions.setFeedData(mutateData(data)));
  } catch (e) {
    yield put(Actions.setFeedDataFailed());
  }
}

export default function* watchFeedSaga() {
  yield takeEvery(ActionTypes.GET_FEED_REQUEST, getFeedData);
}
