/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Step1Option } from './step1';
import { map } from 'lodash';

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

const Step1 = ({ selectGroupType, groupType }) => {
  return (
    <div className='wizard__step1'>
      {map(options, option => {
        return (
          <Step1Option
            key={option.alias}
            title={option.title}
            teaser={option.teaser}
            selectOption={() => {
              selectGroupType(option.alias);
            }}
            isSelected={groupType === option.alias}
          />
        );
      })}
    </div>
  );
};

export default Step1;
