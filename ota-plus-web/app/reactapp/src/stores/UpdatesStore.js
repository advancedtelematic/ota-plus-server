import { observable } from 'mobx';
import axios from 'axios';
import _ from 'underscore';
import {
    API_UPDATES_SEARCH,
    API_GET_MULTI_TARGET_UPDATE_INDENTIFIER,
    API_UPDATES_CREATE,
    LIMIT_UPDATES_WIZARD,
    LIMIT_UPDATES_MAIN,
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
    @observable updatesLimitPage = LIMIT_UPDATES_MAIN; // 30
    @observable updatesOffsetPage = 0;
    @observable updatesTotalCount = 0;
    @observable updatesInitialTotalCount = 0;
    @observable currentPagesLoaded = 1;

    @observable preparedUpdates = {};
    @observable lastCreatedMtuId = null;
    @observable currentMtuData = {};

    @observable updatesWizard = [];
    @observable currentPagesLoadedWizard = 0;
    @observable initialUpdatesWizard = [];
    @observable updatesLimitWizard = LIMIT_UPDATES_WIZARD; // 5
    @observable preparedUpdatesWizard = {};

    constructor() {
        resetAsync(this.updatesFetchAsync);
        resetAsync(this.updatesSafeFetchAsync);
        resetAsync(this.updatesLoadMoreAsync);
        resetAsync(this.updatesMtuCreateAsync);
        resetAsync(this.updatesCreateAsync);
        resetAsync(this.updatesFetchMtuIdAsync);
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
        this.updatesOffsetPage = 0;
        let apiAddress = `${API_UPDATES_SEARCH}?limit=${this.updatesLimitPage}&offset=${this.updatesOffsetPage}`;
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

    loadMoreUpdates(target = 'wizard') {
        resetAsync(this.updatesLoadMoreAsync, true);

        let apiAddress = (target === 'wizard') ?
            `${API_UPDATES_SEARCH}?limit=${this.updatesLimitWizard}&offset=${this.currentPagesLoadedWizard * this.updatesLimitWizard}`
            :
            `${API_UPDATES_SEARCH}?limit=${this.updatesLimitPage}&offset=${this.updatesOffsetPage + this.updatesLimitPage}`;

        return axios.get(apiAddress)
            .then((response) => {

                if (target === 'wizard') {
                    this.updatesWizard = _.uniq(this.updatesWizard.concat(response.data.values), item => item.uuid);
                    this.initialUpdatesWizard = _.uniq(this.initialUpdatesWizard.concat(response.data.values), item => item.uuid);
                    this.currentPagesLoadedWizard++;
                } else {
                    this.updates = _.uniq(this.updatesWizard.concat(response.data.values), item => item.uuid);
                    this.initialUpdates = _.uniq(this.initialUpdates.concat(response.data.values), item => item.uuid);
                    this.updatesOffsetPage = response.data.offset;
                    this.currentPagesLoadedWizard++;
                }

                this.updatesTotalCount = response.data.total;
                this._prepareUpdates(target);
                this.updatesLoadMoreAsync = handleAsyncSuccess(response);
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

    _prepareUpdates(mode = null) {
        let updates = this.sortUpdates(mode === 'wizard' ? this.updatesWizard : this.updates);
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

        if (mode === 'wizard') {
            this.preparedUpdatesWizard = sortedUpdates;
        } else {
            this.preparedUpdates = sortedUpdates;
        }
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
        this.updatesOffsetPage = 0;
        this.updatesTotalCount = 0;
        this.updatesInitialTotalCount = 0;
        this.preparedUpdates = {};
        this.lastCreatedMtuId = null;
        this.updatesLimitPage = LIMIT_UPDATES_MAIN;
    }

    _resetWizardData() {
        resetAsync(this.updatesFetchMtuIdAsync);
        this.updatesWizard = [];
        this.initialUpdatesWizard = [];
        this.preparedUpdatesWizard = {};
        this.updatesLimitWizard = LIMIT_UPDATES_WIZARD;
        this.currentPagesLoadedWizard = 0;
    }
}