/** @format */

import React, { PropTypes, PureComponent } from 'react';
import { CircularProgress } from 'material-ui';
import Cookies from 'js-cookie';

const Loader = ({ className, size, thickness }) => {
  return (
    <div className={'loader' + (className ? ' ' + className : '')}>
      <CircularProgress size={size} thickness={thickness} />
    </div>
  );
};

Loader.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
  thickness: PropTypes.number,
};

Loader.defaultProps = {
  size: 40,
  thickness: 3.5,
};

export default Loader;
