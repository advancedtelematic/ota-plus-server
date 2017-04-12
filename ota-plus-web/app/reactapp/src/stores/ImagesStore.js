import { observable } from 'mobx';
import axios from 'axios';
import _ from 'underscore';
import { 
    resetAsync,
    handleAsyncSuccess, 
    handleAsyncError 
} from '../utils/Common';

export default class ImagesStore {

    @observable imagesFetchAsync = {};
    @observable images = {};
    @observable preparedImages = {};
    @observable imagesFilter = null;
    @observable imagesSort = 'asc';

    constructor() {
        resetAsync(this.imagesFetchAsync);
    }

    fetchImages(deviceId) {
        resetAsync(this.imagesFetchAsync, true);
        setTimeout(() => {
            var response = [
                {
                    uuid: 1,
                    name: 'First',
                    hash: 'hash1',
                    createdAt: "2016-11-24T15:21:28Z",
                },
                {
                    uuid: 2,
                    name: 'Second',
                    hash: 'hash1',
                    createdAt: "2016-02-24T07:00:28Z",
                },
                {
                    uuid: 3,
                    name: 'Third',
                    hash: 'hash1',
                    createdAt: "2017-03-24T22:13:28Z",
                },
                {
                    uuid: 4,
                    name: 'First',
                    hash: 'hash1',
                    createdAt: "2017-03-24T22:13:28Z",
                },
                {
                    uuid: 5,
                    name: 'Fourth',
                    hash: 'hash1',
                    createdAt: "2017-03-24T22:13:28Z",
                },
                {
                    uuid: 6,
                    name: 'Fifth',
                    hash: 'hash1',
                    createdAt: "2017-03-24T22:13:28Z",
                }
            ];
            this.images = response;
            this._prepareImages();
            this.imagesFetchAsync = handleAsyncSuccess(response);
        }, 2000);
    }

    _prepareImages(imagesSort = this.imagesSort) {
        let images = [];
        let groupedImages = {};
        let sortedImages = {};
        this.imagesSort = imagesSort;
        _.each(this.images, (obj, index) => {
            if(_.isUndefined(groupedImages[obj.name]) || !groupedImages[obj.name] instanceof Array) {
                groupedImages[obj.name] = new Object();
                groupedImages[obj.name].versions = [];
                groupedImages[obj.name].imageName = obj.name;
                groupedImages[obj.name].isAutoInstallEnabled = Math.random() > 0.5;
                groupedImages[obj.name].isInstalled = true;
            }
            groupedImages[obj.name].versions.push(obj);
        }, this);
        _.each(groupedImages, (obj, index) => {
            groupedImages[index].versions = _.sortBy(obj.versions, (image) => {
                return image.createdAt;
            }).reverse();
        });
        let specialGroup = {'#' : []};
        Object.keys(groupedImages).sort((a, b) => {
            if(imagesSort !== 'undefined' && imagesSort == 'desc')
                return b.localeCompare(a);
            else
                return a.localeCompare(b);
        }).forEach((key) => {
            let firstLetter = key.charAt(0).toUpperCase();
            firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
            if(firstLetter != '#' && _.isUndefined(sortedImages[firstLetter]) || !sortedImages[firstLetter] instanceof Array) {
                sortedImages[firstLetter] = [];
            }
            if(firstLetter != '#')
                sortedImages[firstLetter].push(groupedImages[key]);
            else
                specialGroup['#'].push(groupedImages[key]);
        });
        if(!_.isEmpty(specialGroup['#'])) {
            sortedImages = (imagesSort !== 'undefined' && imagesSort == 'desc' ? Object.assign(specialGroup, sortedImages) : Object.assign(sortedImages, specialGroup));
        }
        this.preparedImages = sortedImages;
    }

    _reset() {
        resetAsync(this.imagesFetchAsync);
        this.images = {};
        this.preparedImages = {};
        this.imagesFilter = null;
        this.imagesSort = 'asc';
    }
}