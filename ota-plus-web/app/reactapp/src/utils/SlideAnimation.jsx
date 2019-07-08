/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { VelocityTransitionGroup } from 'velocity-react';

const SlideAnimation = ({ display, changeDisplay, runOnMount, children }) => (
  <VelocityTransitionGroup
    enter={{ animation: 'slideDown', display: changeDisplay ? display : undefined }}
    leave={{ animation: 'slideUp', display: changeDisplay ? display : undefined }}
    runOnMount={runOnMount}
  >
    {children}
  </VelocityTransitionGroup>
);

SlideAnimation.propTypes = {
  display: PropTypes.string,
  changeDisplay: PropTypes.bool,
  runOnMount: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string
  ])
};

SlideAnimation.defaultProps = {
  display: 'inherit',
  changeDisplay: true,
  runOnMount: true,
};

export default SlideAnimation;
