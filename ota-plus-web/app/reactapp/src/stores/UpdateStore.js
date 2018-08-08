import { observable, computed } from 'mobx';
import axios from 'axios';
import _ from 'underscore';
import {
    API_UPDATES_SEARCH
} from '../config';
import {
    resetAsync,
    handleAsyncSuccess,
    handleAsyncError
} from '../utils/Common';

export default class UpdateStore {
    @observable updatesFetchAsync = {};
    @observable updatesLoadMoreAsync = {};

    @observable updates = [];
    @observable updatesLimit = 30;
    @observable updatesOffset = 0;
    @observable updatesFilter = '';
    @observable updatesTotalCount = 0;
    @observable updatesInitialTotalCount = 0;
    @observable preparedUpdates = {};

    constructor() {
        resetAsync(this.updatesFetchAsync);
    }

    fetchUpdates(filter = '') {
        resetAsync(this.updatesFetchAsync, true);
        filter = filter.toLowerCase();
        this.updatesOffset = 0;
        this.updatesFilter = filter;
        let apiAddress = `${API_UPDATES_SEARCH}?regex=${filter}&limit=${this.updatesLimit}&offset=${this.updatesOffset}`;
        return axios.get(apiAddress)
             .then((response) => {
                 this.updates = response.data.values;
                 this.updatesTotalCount = response.data.total;

                 if (!this.updatesInitialTotalCount) {
                     this.updatesInitialTotalCount = response.data.total;
                 }
                 this._prepareUpdates();
                 this.updatesFetchAsync = handleAsyncSuccess(response);
             })
             .catch((error) => {
                 this.updatesFetchAsync = handleAsyncError(error);
             });
    }

    loadMoreUpdates(filter = '') {
        resetAsync(this.updatesLoadMoreAsync, true);
        let apiAddress = `${API_UPDATES_SEARCH}?regex=${filter}&limit=${this.updatesLimit}&offset=${this.updatesOffset + this.updatesLimit}`;
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

    _prepareUpdates() {
        let updates = this.updates;
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
        resetAsync(this.updatesLoadMoreAsync);

        this.updates = [];
        this.updatesOffset = 0;
        this.updatesFilter = '';
        this.updatesTotalCount = 0;
        this.updatesInitialTotalCount = 0;
        this.preparedUpdates = {};
    }
}