import _ from 'underscore';

const _contains = (objects, item) => {
    const { type } = item;
    const useId = _.isUndefined(type);
    // default compare
    let compare = {};

    if (useId) {
        compare = { id: item.id };
    } else if (type === 'update') {
        compare = {
            uuid: item.uuid,
        }
    } else {
        compare = {
            name: item.name,
        }
    }

    return _.isObject(_.find(objects, compare));
};

export {
    _contains,
}