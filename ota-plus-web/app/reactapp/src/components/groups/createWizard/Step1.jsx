/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { map } from 'lodash';
import Option from './step1/Option';

const options = [
  {
    title: 'Fixed group',
    teaser: 'A group that contains a fixed list of devices. To add devices, you drag and drop them from the device view.',
    alias: 'classic',
  },
  {
    title: 'Smart group',
    teaser: 'A group that is based on a device filter. New devices are automatically added if they match the filter criteria.',
    alias: 'smart',
  },
];
const Step1 = ({ groupType, onStep1DataSelect }) => {
  return (
    <div className="wizard__step1">
      {map(options, (option) => {
        return (
          <Option
            key={option.alias}
            title={option.title}
            teaser={option.teaser}
            selectOption={() => {
              onStep1DataSelect(option.alias);
            }}
            isSelected={groupType === option.alias}
          />
        );
      })}
    </div>
  );
};

Step1.propTypes = {
  onStep1DataSelect: PropTypes.func.isRequired,
  groupType: PropTypes.string.isRequired,
};

export default Step1;
