/** @format */

import React from 'react';
import PropTypes from 'prop-types';

import CreateClassicGroup from './step2/CreateClassicGroup';
import CreateSmartGroup from './step2/CreateSmartGroup';

const Step2 = ({ groupType, onStep2DataSelect }) => {
  return (
    <div className="wizard__step2">
      {groupType === 'classic' ? (
        <CreateClassicGroup onStep2DataSelect={onStep2DataSelect} />
      ) : (
        <CreateSmartGroup onStep2DataSelect={onStep2DataSelect} />
      )}
    </div>
  );
};

Step2.propTypes = {
  onStep2DataSelect: PropTypes.func.isRequired,
  groupType: PropTypes.string.isRequired,
};

export default Step2;
