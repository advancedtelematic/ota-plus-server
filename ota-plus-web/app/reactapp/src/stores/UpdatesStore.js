import { observable, computed } from 'mobx';
import axios from 'axios';
import _ from 'underscore';
import {
    API_UPDATES_SEARCH,
    API_GET_MULTI_TARGET_UPDATE_INDENTIFIER,
    API_UPDATES_CREATE,
} from '../config';
import {
    resetAsync,
    handleAsyncSuccess,
    handleAsyncError
} from '../utils/Common';

export default class UpdatesStore {
    @observable updatesFetchAsync = {};
    @observable updatesSafeFetchAsync = {};
    @observable updatesLoadMoreAsync = {};
    @observable updatesMtuCreateAsync = {};
    @observable updatesCreateAsync = {};
    @observable updatesFetchMtuIdAsync = {};

    @observable initialUpdates = [];
    @observable updates = [];
    @observable updateFilter = '';
    @observable updatesLimit = 30;
    @observable updatesOffset = 0;
    @observable updatesTotalCount = 0;
    @observable updatesInitialTotalCount = 0;
    @observable preparedUpdates = {};
    @observable lastCreatedMtuId = null;
    @observable currentMtuData = {};

    constructor() {
        resetAsync(this.updatesFetchAsync);
        resetAsync(this.updatesSafeFetchAsync);
        resetAsync(this.updatesLoadMoreAsync);
        resetAsync(this.updatesMtuCreateAsync);
        resetAsync(this.updatesCreateAsync);
    }

    createMultiTargetUpdate(data) {
        let updateObject = this._prepareUpdateObject(data);
        resetAsync(this.updatesMtuCreateAsync, true);
        return axios.post(API_GET_MULTI_TARGET_UPDATE_INDENTIFIER, updateObject)
            .then((response) => {
                this.lastCreatedMtuId = response.data;
                this.updatesMtuCreateAsync = handleAsyncSuccess(response);
            })
            .catch((error) => {
                this.updatesMtuCreateAsync = handleAsyncError(error);
            });
    }

    _prepareUpdateObject(data) {
        let targets = {};
        _.each(data, (values, hwId) => {
            targets[hwId] = {
                from: {
                    target: values.fromVersion.filepath,
                    checksum: {
                        method: "sha256",
                        hash: values.fromVersion.packageHash
                    },
                    targetLength: values.fromVersion.targetLength
                },
                to: {
                    target: values.toVersion.filepath,
                    checksum: {
                        method: "sha256",
                        hash: values.toVersion.packageHash
                    },
                    targetLength: values.toVersion.targetLength
                },
                targetFormat: values.toVersion.targetFormat,
                generateDiff: false
            }
        });
        return {
            targets
        };
    }

    createUpdate(data) {
        resetAsync(this.updatesCreateAsync, true);
        return axios.post(API_UPDATES_CREATE, data)
            .then((response) => {
                this.fetchUpdates('updatesSafeFetchAsync')
                this.updatesCreateAsync = handleAsyncSuccess(response);
            })
            .catch((error) => {
                this.updatesCreateAsync = handleAsyncError(error);
            });
    }

    fetchUpdates(async = 'updatesFetchAsync') {
        resetAsync(this[async], true);
        this.updatesOffset = 0;
        let apiAddress = `${API_UPDATES_SEARCH}?limit=${this.updatesLimit}&offset=${this.updatesOffset}`;
        return axios.get(apiAddress)
            .then((response) => {
                this.updates = response.data.values;
                this.initialUpdates = response.data.values;
                this.updatesTotalCount = response.data.total;

                if (!this.updatesInitialTotalCount) {
                    this.updatesInitialTotalCount = response.data.total;
                }
                this._prepareUpdates();
                this[async] = handleAsyncSuccess(response);
            })
            .catch((error) => {
                this[async] = handleAsyncError(error);
            });
    }

    loadMoreUpdates() {
        resetAsync(this.updatesLoadMoreAsync, true);
        let apiAddress = `${API_UPDATES_SEARCH}?limit=${this.updatesLimit}&offset=${this.updatesOffset + this.updatesLimit}`;
        return axios.get(apiAddress)
            .then((response) => {
                this.updates = _.uniq(this.updates.concat(response.data.values), item => item.uuid);
                this.initialUpdates = _.uniq(this.initialUpdates.concat(response.data.values), item => item.uuid);
                this.updatesOffset = response.data.offset;
                this._prepareUpdates();
                this.updatesLoadMoreAsync = handleAsyncSuccess(response);
            })
            .catch((error) => {
                this.updatesLoadMoreAsync = handleAsyncError(error);
            });
    }

    fetchUpdate(mtuId) {
        resetAsync(this.updatesFetchMtuIdAsync, true);
        let apiAddress = `${API_GET_MULTI_TARGET_UPDATE_INDENTIFIER}/${mtuId}`;

        const { mtuId: currentMtuId } = this.currentMtuData;

        if (currentMtuId === mtuId) {
            resetAsync(this.updatesFetchMtuIdAsync, false);
            return;
        }

        return axios.get(apiAddress)
            .then((response) => {
                this.currentMtuData = {
                    mtuId: mtuId,
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
        return _.sortBy(updates, function (update) { return update.name.toLowerCase() });
    }

    _prepareUpdates() {
        let updates = this.sortUpdates();
        let sortedUpdates = {};
        let specialGroup = {
            '#': []
        };

        _.pluck(updates, 'name').forEach((name, key) => {
            let firstLetter = name.charAt(0).toUpperCase();
            firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
            if (firstLetter != '#' && _.isUndefined(sortedUpdates[firstLetter]) || !sortedUpdates[firstLetter] instanceof Array) {
                sortedUpdates[firstLetter] = [];
            }
            if (firstLetter != '#') {
                sortedUpdates[firstLetter].push(updates[key]);
            } else {
                specialGroup['#'].push(updates[key]);
            }
        });
        if (!_.isEmpty(specialGroup['#'])) {
            sortedUpdates = Object.assign(sortedUpdates, specialGroup);
        }
        this.preparedUpdates = sortedUpdates;
    }

    _filterUpdates(filter) {
        filter = filter.toLowerCase();
        this.updateFilter = filter;
        let searchResults = _.filter(this.initialUpdates, update => {
            return update.name.toLowerCase().indexOf(filter) >= 0;
        });
        this.updates = searchResults;
        this._prepareUpdates();
    }

    _reset() {
        resetAsync(this.updatesFetchAsync);
        resetAsync(this.updatesSafeFetchAsync);
        resetAsync(this.updatesLoadMoreAsync);
        resetAsync(this.updatesMtuCreateAsync);
        resetAsync(this.updatesCreateAsync);

        this.updates = [];
        this.initialUpdates = [];
        this.updateFilter = '';
        this.updatesOffset = 0;
        this.updatesTotalCount = 0;
        this.updatesInitialTotalCount = 0;
        this.preparedUpdates = {};
        this.lastCreatedMtuId = null;
    }
}