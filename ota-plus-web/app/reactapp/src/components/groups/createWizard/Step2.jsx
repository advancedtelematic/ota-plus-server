/** @format */

import React from 'react';
import PropTypes from 'prop-types';

import { GROUP_GROUP_TYPE_CLASSIC } from '../../../constants/groupConstants';
import CreateClassicGroup from './step2/CreateClassicGroup';
import SmartGroupWizard from './step2/smartGroup/SmartGroupWizard';

const Step2 = ({ groupType, onStep2DataSelect }) => (
  <div className="wizard__step2">
    {groupType === GROUP_GROUP_TYPE_CLASSIC ? (
      <CreateClassicGroup onStep2DataSelect={onStep2DataSelect} />
    ) : (
      <SmartGroupWizard onStep2DataSelect={onStep2DataSelect} />
    )}
  </div>
);

Step2.propTypes = {
  onStep2DataSelect: PropTypes.func.isRequired,
  groupType: PropTypes.string.isRequired,
};

export default Step2;
