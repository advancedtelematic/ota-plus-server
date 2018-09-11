import _ from 'underscore';

const _contains = (objects, item) => {
    const { source, type } = item;
    let compare = {};

    if (source && type === 'update') {
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