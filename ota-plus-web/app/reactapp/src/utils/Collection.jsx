import _ from 'underscore';

const _contains = (collectionAsArray, item) => {
    return _.isObject(_.find(collectionAsArray, {name: item.name}));
};


export {
    _contains,
}