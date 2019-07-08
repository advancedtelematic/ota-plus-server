/** @format */

import { observable } from 'mobx';
import axios from 'axios';
import _ from 'lodash';
import {
  API_UPDATES_SEARCH,
  API_GET_MULTI_TARGET_UPDATE_INDENTIFIER,
  API_UPDATES_CREATE,
  LIMIT_UPDATES_WIZARD,
  UPDATES_LIMIT_PER_PAGE
} from '../config';
import { resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';

export default class UpdatesStore {
  @observable updatesFetchAsync = {};

  @observable updatesSafeFetchAsync = {};

  @observable updatesLoadMoreAsync = {};

  @observable updatesMtuCreateAsync = {};

  @observable updatesCreateAsync = {};

  @observable updatesFetchMtuIdAsync = {};

  @observable updatesWizardFetchAsync = {};

  @observable updates = [];

  @observable updateFilter = '';

  @observable updatesLimitPage = UPDATES_LIMIT_PER_PAGE;

  @observable updatesTotalCount = 0;

  @observable preparedUpdates = {};

  @observable lastCreatedMtuId = null;

  @observable currentMtuData = {};

  @observable updatesWizard = [];

  @observable preparedUpdatesWizard = {};

  @observable updatesLimitWizard = LIMIT_UPDATES_WIZARD;

  @observable updatesOffsetWizard = 0;

  @observable hasMoreWizardUpdates = false;

  constructor() {
    resetAsync(this.updatesFetchAsync);
    resetAsync(this.updatesSafeFetchAsync);
    resetAsync(this.updatesLoadMoreAsync);
    resetAsync(this.updatesMtuCreateAsync);
    resetAsync(this.updatesCreateAsync);
    resetAsync(this.updatesFetchMtuIdAsync);
    resetAsync(this.updatesWizardFetchAsync);
  }

  createMultiTargetUpdate(data) {
    const updateObject = this.prepareUpdateObject(data);
    resetAsync(this.updatesMtuCreateAsync, true);
    return axios
      .post(API_GET_MULTI_TARGET_UPDATE_INDENTIFIER, updateObject)
      .then((response) => {
        this.lastCreatedMtuId = response.data;
        this.updatesMtuCreateAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.updatesMtuCreateAsync = handleAsyncError(error);
      });
  }

  prepareUpdateObject = (data) => {
    const targets = {};
    _.each(data, (values, hwId) => {
      targets[hwId] = {
        ...(!values.updateFromAny && {
          from: {
            target: values.fromVersion.filepath,
            checksum: {
              method: 'sha256',
              hash: values.fromVersion.packageHash,
            },
            targetLength: values.fromVersion.targetLength,
          }
        }),
        to: {
          target: values.toVersion.filepath,
          checksum: {
            method: 'sha256',
            hash: values.toVersion.packageHash,
          },
          targetLength: values.toVersion.targetLength,
        },
        targetFormat: values.toVersion.targetFormat,
        generateDiff: false,
      };
    });
    return {
      targets,
    };
  }

  createUpdate(data) {
    resetAsync(this.updatesCreateAsync, true);
    return axios
      .post(API_UPDATES_CREATE, data)
      .then((response) => {
        this.fetchUpdates('updatesSafeFetchAsync');
        this.updatesCreateAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.updatesCreateAsync = handleAsyncError(error);
      });
  }

  fetchUpdates(async = 'updatesFetchAsync', dataOffset = 0) {
    resetAsync(this[async], true);
    const limit = `limit=${this.updatesLimitPage}`;
    const nameContains = `nameContains=${this.updateFilter.toLowerCase()}`;
    const offset = `offset=${dataOffset}`;
    const apiAddress = `${API_UPDATES_SEARCH}?${nameContains}&${limit}&${offset}&sortBy=createdAt`;
    return axios
      .get(apiAddress)
      .then((response) => {
        this.updates = response.data.values;
        this.updatesTotalCount = response.data.total;
        this.prepareUpdates();
        this[async] = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this[async] = handleAsyncError(error);
      });
  }

  fetchWizardUpdates(selectedGroupIds, async = 'updatesWizardFetchAsync') {
    resetAsync(this[async], true);
    const groupApi = selectedGroupIds.map(groupId => `&groupId=${groupId}`).join('');
    const apiAddress = `${API_UPDATES_SEARCH}?limit=${this.updatesLimitWizard}&offset=${this.updatesOffsetWizard}${groupApi}`;
    return axios
      .get(apiAddress)
      .then((response) => {
        this.updatesWizard = response.data.values;
        this.prepareUpdates('wizard');
        this[async] = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this[async] = handleAsyncError(error);
      });
  }

  loadMoreWizardUpdates(async = 'updatesWizardLoadMoreAsync') {
    resetAsync(this[async], true);
    const apiAddress = `${API_UPDATES_SEARCH}?limit=${this.updatesLimitWizard}&offset=${this.updatesOffsetWizard + this.updatesLimitWizard}`;

    return axios
      .get(apiAddress)
      .then((response) => {
        this.updatesWizard = _.uniqBy(this.updatesWizard.concat(response.data.values), item => item.uuid);
        this.prepareUpdates('wizard');
        this[async] = handleAsyncSuccess(response);

        this.updatesWizardOffset = response.data.offset;
        this.hasMoreWizardUpdates = this.updatesWizardOffset < response.data.total;
      })
      .catch((error) => {
        this.updatesLoadMoreAsync = handleAsyncError(error);
      });
  }

  fetchUpdate(mtuId) {
    resetAsync(this.updatesFetchMtuIdAsync, true);
    const apiAddress = `${API_GET_MULTI_TARGET_UPDATE_INDENTIFIER}/${mtuId}`;

    const { mtuId: currentMtuId } = this.currentMtuData;

    if (currentMtuId === mtuId) {
      resetAsync(this.updatesFetchMtuIdAsync, false);
      return;
    }

    axios
      .get(apiAddress)
      .then((response) => {
        this.currentMtuData = {
          mtuId,
          data: response.data,
        };

        this.updatesFetchMtuIdAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.currentMtuData = {};
        this.updatesFetchMtuIdAsync = handleAsyncError(error);
      });
  }

  sortUpdates(updates = this.updates) {
    return _.sortBy(updates, update => update.name.toLowerCase());
  }

  prepareUpdates(mode = null) {
    const updates = mode === 'wizard' ? this.sortUpdates(this.updatesWizard) : this.updates;
    const specialGroup = {
      '#': [],
    };
    let sortedUpdates = {};

    updates.forEach((update, index) => {
      let firstLetter = update.name.charAt(0).toUpperCase();
      firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
      if ((firstLetter !== '#' && _.isUndefined(sortedUpdates[firstLetter]))
        || !Array.isArray(sortedUpdates[firstLetter])) {
        sortedUpdates[firstLetter] = [];
      }
      if (firstLetter !== '#') {
        sortedUpdates[firstLetter].push(updates[index]);
      } else {
        specialGroup['#'].push(updates[index]);
      }
    });
    if (!_.isEmpty(specialGroup['#'])) {
      sortedUpdates = Object.assign(sortedUpdates, specialGroup);
    }

    if (mode === 'wizard') {
      this.preparedUpdatesWizard = sortedUpdates;
    } else {
      this.preparedUpdates = sortedUpdates;
    }
  }

  filterUpdates(filter) {
    this.updateFilter = filter;
    this.fetchUpdates('updatesFetchAsync', 0);
  }

  reset() {
    resetAsync(this.updatesFetchAsync);
    resetAsync(this.updatesSafeFetchAsync);
    resetAsync(this.updatesLoadMoreAsync);
    resetAsync(this.updatesMtuCreateAsync);
    resetAsync(this.updatesCreateAsync);
    resetAsync(this.updatesCreateAsync);
    resetAsync(this.updatesWizardFetchAsync);

    this.updates = [];
    this.updateFilter = '';
    this.updatesTotalCount = 0;
    this.preparedUpdates = {};
    this.lastCreatedMtuId = null;
    this.updatesLimitPage = UPDATES_LIMIT_PER_PAGE;
  }

  _resetWizardData() {
    resetAsync(this.updatesFetchMtuIdAsync);
    this.updatesWizard = [];
    this.preparedUpdatesWizard = {};
    this.updatesLimitWizard = LIMIT_UPDATES_WIZARD;
  }
}
