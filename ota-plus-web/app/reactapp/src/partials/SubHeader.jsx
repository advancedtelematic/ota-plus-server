/** @format */

import PropTypes from 'prop-types';
import React from 'react';

const SubHeader = (props) => {
  const { children, className, shouldSubHeaderBeHidden } = props;

  return (
    <div className={`subheader ${className || ''}`} style={shouldSubHeaderBeHidden && { display: 'none' }}>
      {children}
    </div>
  );
};

SubHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.array]),
  shouldSubHeaderBeHidden: PropTypes.bool,
};

export default SubHeader;
