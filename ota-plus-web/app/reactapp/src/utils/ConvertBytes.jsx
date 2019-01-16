/** @format */

import PropTypes from 'prop-types';
import React from 'react';

const ConvertBytes = props => {
  let { bytes } = props;
  bytes = parseFloat(bytes);
  return (
    <span>
      {bytes < 1024
        ? bytes.toFixed(1) + ' B'
        : bytes < 1024 * 1024
        ? (bytes / 1024).toFixed(1) + ' KB'
        : bytes < 1024 * 1024 * 1024
        ? (bytes / (1024 * 1024)).toFixed(1) + 'MB'
        : (bytes / (1024 * 1024 * 1024)).toFixed(1) + 'GB'}
    </span>
  );
};

ConvertBytes.propTypes = {
  bytes: PropTypes.any.isRequired,
};

export default ConvertBytes;
