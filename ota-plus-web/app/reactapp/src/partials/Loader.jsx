/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { Spin, Icon } from 'antd';

const Loader = ({ className, size }) => {
  const spinIcon = <Icon type="loading-3-quarters" spin style={{ fontSize: size }} />;

  return <Spin className={`loader${className ? ` ${className}` : ''}`} indicator={spinIcon} />;
};

Loader.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

Loader.defaultProps = {
  size: 40,
};

export default Loader;
