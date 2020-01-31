/* eslint-disable no-underscore-dangle */
/** @format */

import { observable } from 'mobx';
import axios from 'axios';
import moment from 'moment';
import { API_RECENTLY_CREATED } from '../config';
import { resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';
import { ACTIVITIES_TYPE, ACTIVITIES_TYPE_PARAMS } from '../constants';

export default class RecentlyCreatedStore {
  @observable recentlyCreatedFetchAsync = {};

  @observable recentlyCreated = [];

  constructor() {
    resetAsync(this.recentlyCreatedFetchAsync);
  }

  createItemData = (date, name, type) => ({ date: moment(date).format('ddd MMM D YYYY HH:mm'), title: name, type });

  createDeviceGroupItemData = (date, name, type, groupType) => ({
    ...this.createItemData(date, name, type),
    groupType
  });

  async fetchRecentlyCreated(types = ACTIVITIES_TYPE_PARAMS) {
    resetAsync(this.recentlyCreatedFetchAsync, true);
    try {
      const url = API_RECENTLY_CREATED.replace('$types', types.join(','));
      const { data } = await axios.get(url);
      this.recentlyCreated = [];
      const recentlyCreated = [];
      data.forEach((item) => {
        switch (item._type) {
          case ACTIVITIES_TYPE.CAMPAIGN:
            recentlyCreated.push(this.createItemData(item.createdAt, item.resource.name, item._type));
            break;
          case ACTIVITIES_TYPE.DEVICE:
            recentlyCreated.push(this.createItemData(item.createdAt, item.resource.deviceName, item._type));
            break;
          case ACTIVITIES_TYPE.DEVICE_GROUP:
            recentlyCreated.push(this.createDeviceGroupItemData(
              item.createdAt,
              item.resource.groupName,
              item._type,
              item.resource.groupType
            ));
            break;
          case ACTIVITIES_TYPE.SOFTWARE_UPDATE:
            recentlyCreated.push(this.createItemData(item.createdAt, item.resource.name, item._type));
            break;
          case ACTIVITIES_TYPE.SOFTWARE_VERSION:
            recentlyCreated.push(this.createItemData(item.createdAt, item.resource.name, item._type));
            break;
          default:
            break;
        }
      });
      this.recentlyCreated = recentlyCreated;
      this.recentlyCreatedFetchAsync = handleAsyncSuccess({ data });
    } catch (error) {
      this.recentlyCreatedFetchAsync = handleAsyncError(error);
    }
  }

  reset() {
    resetAsync(this.featuresFetchAsync);
  }
}
