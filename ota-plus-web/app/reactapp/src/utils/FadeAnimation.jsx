/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { VelocityTransitionGroup } from 'velocity-react';

const FadeAnimation = ({ runOnMount, display, children }) => (
  <VelocityTransitionGroup
    component="span"
    enter={{ animation: 'fadeIn', display }}
    leave={{ animation: 'fadeOut', display }}
    runOnMount={runOnMount}
  >
    {children}
  </VelocityTransitionGroup>
);

FadeAnimation.propTypes = {
  display: PropTypes.string,
  runOnMount: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string
  ])
};

FadeAnimation.defaultProps = {
  display: 'inherit',
  runOnMount: true,
};

export default FadeAnimation;
