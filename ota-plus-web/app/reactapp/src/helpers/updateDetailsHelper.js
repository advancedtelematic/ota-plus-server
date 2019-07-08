import _ from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const getUpdateDetails = (mtuData, packages) => {
  const updateDetails = [];
  _.each(mtuData, (target, hardwareId) => {
    const { target: fromTarget } = target.from || {};
    const { target: toTarget, checksum } = target.to;
    const targetDetails = {};
    targetDetails.hardwareId = hardwareId;
    targetDetails.checksum = checksum;
    _.find(packages, (pack) => {
      const { name, version } = pack.id;
      if (pack.filepath === fromTarget) {
        targetDetails.fromPackage = name;
        targetDetails.fromVersion = version;
      }
      if (pack.filepath === toTarget) {
        targetDetails.toPackage = name;
        targetDetails.toVersion = version;
        targetDetails.toTarget = toTarget;
      }
    });
    updateDetails.push(targetDetails);
  });
  return updateDetails;
};
