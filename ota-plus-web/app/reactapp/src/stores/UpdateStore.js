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

export default class UpdateStore {
    @observable updatesFetchAsync = {};
    @observable updatesSafeFetchAsync = {};
    @observable updatesLoadMoreAsync = {};
    @observable updatesMtuCreateAsync = {};
    @observable updatesCreateAsync = {};

    @observable updates = [];
    @observable updatesLimit = 30;
    @observable updatesOffset = 0;
    @observable updatesTotalCount = 0;
    @observable updatesInitialTotalCount = 0;
    @observable preparedUpdates = {};
    @observable lastCreatedMtuId = null;

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
        const { packs } = data;
        const { hardwareIds } = data;
        let targets = {};
        _.each(hardwareIds, hwId => {
            targets[hwId] = {
                from: {
                    target: packs.fromVersion.filepath,
                    checksum: {
                        method:"sha256",
                        hash: packs.fromVersion.packageHash
                    },
                    targetLength: packs.fromVersion.targetLength
                },
                to: {
                    target: packs.toVersion.filepath,
                    checksum: {
                        method:"sha256",
                        hash: packs.toVersion.packageHash
                    },
                    targetLength: packs.toVersion.targetLength
                },
                targetFormat: packs.toVersion.targetFormat,
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
                this.updatesOffset = response.data.offset;
                this._prepareUpdates();
                this.updatesLoadMoreAsync = handleAsyncSuccess(response);
            })
            .catch((error) => {
                this.updatesLoadMoreAsync = handleAsyncError(error);
            });
    }


    sortUpdates(updates = this.updates, property = "name", order = "asc") {
        return _.sortBy(updates, property, order);
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

    _reset() {
        resetAsync(this.updatesFetchAsync);
        resetAsync(this.updatesSafeFetchAsync);
        resetAsync(this.updatesLoadMoreAsync);
        resetAsync(this.updatesMtuCreateAsync);
        resetAsync(this.updatesCreateAsync);

        this.updates = [];
        this.updatesOffset = 0;
        this.updatesTotalCount = 0;
        this.updatesInitialTotalCount = 0;
        this.preparedUpdates = {};
        this.lastCreatedMtuId = null;
    }
}