import { observable } from 'mobx';
import axios from 'axios';
import {
    API_FEATURES_FETCH
} from '../config';
import {
    resetAsync,
    handleAsyncSuccess,
    handleAsyncError
} from '../utils/Common';
import _ from 'underscore';
import { whatsNew } from "./data/newFeatures";
import Cookies from 'js-cookie';

export default class FeaturesStore {
    @observable featuresFetchAsync = {};
    @observable features = [];
    @observable clientId = null;
    @observable alphaPlusEnabled = false;
    @observable alphaTestEnabled = false;
    @observable whatsNew = whatsNew;

    @observable whatsNewPopOver = false;
    @observable whatsNewPostponed = false;
    @observable whatsNewShowPage = false;

    constructor() {
        resetAsync(this.featuresFetchAsync);
    }

    resetFeaturesFetchAsync(isFetching = false) {
        this.featuresFetchAsync = {
            isFetching: isFetching,
            status: null
        }
    }

    fetchFeatures() {
        resetAsync(this.featuresFetchAsync, true);
        return axios.get(API_FEATURES_FETCH)
            .then(function (response) {
                this.features = response.data;
                if (_.contains(response.data, 'alphaplus')) {
                    this.alphaPlusEnabled = true;
                }
                if (_.contains(response.data, 'alphatest')) {
                    this.alphaTestEnabled = true;
                }

                this.featuresFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.featuresFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    checkWhatsNewStatus() {
        const currentVersion = _.last(Object.keys(this.whatsNew));
        const WHATS_NEW_DELAY = Cookies.get('WHATS_NEW_DELAY');
        const WHATS_NEW_HIDE = Cookies.get('WHATS_NEW_HIDE');
        const WHATS_NEW_HIDE_VERSION = Cookies.get('WHATS_NEW_HIDE_VERSION');

        if (currentVersion === WHATS_NEW_HIDE_VERSION) {
            this.whatsNewShowPage = true;
        } else {
            if (WHATS_NEW_HIDE) {
                Cookies.set('WHATS_NEW_HIDE', 'false');
                Cookies.remove('WHATS_NEW_HIDE_VERSION');
                this.whatsNewPopOver = true;
            }
        }

        if (WHATS_NEW_DELAY && !WHATS_NEW_HIDE) {
            this.whatsNewPostponed = true;
        }

        if (!WHATS_NEW_DELAY && !WHATS_NEW_HIDE ) {
            this.whatsNewPopOver = true;
        }
    }


    setWhatsNewDelay() {
        Cookies.set('WHATS_NEW_DELAY', true, {expires: 1});
        this.whatsNewPopOver = false;
        this.whatsNewPostponed = true;
    }

    setWhatsNewHide() {
        const currentVersion = _.last(Object.keys(this.whatsNew));
        Cookies.set('WHATS_NEW_HIDE', 'true');
        Cookies.set('WHATS_NEW_HIDE_VERSION', currentVersion);
        Cookies.remove('WHATS_NEW_DELAY');
        this.whatsNewPopOver = false;
        this.whatsNewPostponed = false;
        this.whatsNewShowPage = true;
    }

    _reset() {
        resetAsync(this.featuresFetchAsync);
    }
}
