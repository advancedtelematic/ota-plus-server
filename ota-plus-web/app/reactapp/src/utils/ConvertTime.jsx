/** @format */

import PropTypes from 'prop-types';
import React from 'react';

import { getTimeLeft } from '../helpers/timeConverterHelper';

const ConvertTime = (props) => {
  const { seconds } = props;
  return (
    <span>
      {getTimeLeft(seconds)}
    </span>
  );
};

ConvertTime.propTypes = {
  seconds: PropTypes.number.isRequired
};

export default ConvertTime;
