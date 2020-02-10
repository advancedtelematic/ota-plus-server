/** @format */

import _ from 'lodash';
import { DATA_TYPE, SHA_256 } from '../constants';

const contains = (objects, item, compareAs) => {
  const useId = _.isUndefined(compareAs);
  // default compare
  let compare = {};

  if (useId) {
    compare = { id: item.id };
  } else if (compareAs === DATA_TYPE.UPDATE) {
    compare = {
      uuid: item.uuid,
    };
  } else if (compareAs === DATA_TYPE.HARDWARE) {
    compare = {
      name: item.name,
    };
  } else {
    compare = {
      name: item.name,
    };
  }

  return _.isObject(_.find(objects, compare));
};

const prepareUpdateObject = (data) => {
  const targets = {};
  _.each(data, (item) => {
    targets[item.hardwareId] = {
      from: {
        target: item.from.target,
        checksum: {
          method: SHA_256,
          hash: item.from.hash,
        },
        targetLength: item.from.targetLength,
      },
      to: {
        target: item.to.target,
        checksum: {
          method: SHA_256,
          hash: item.to.hash,
        },
        targetLength: item.to.targetLength,
      },
      targetFormat: item.targetFormat,
      generateDiff: item.generateDiff,
    };
  });
  return {
    targets,
  };
};

const getSHA256Hash = mtu => mtu.targets[Object.keys(mtu.targets)[0]].image.fileinfo.hashes.sha256;

const getCurrentLocation = location => location.pathname.split('/')[1];

export { contains, prepareUpdateObject, getSHA256Hash, getCurrentLocation };
