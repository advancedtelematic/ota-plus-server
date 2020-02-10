/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { VelocityTransitionGroup } from 'velocity-react';
import { SLIDE_ANIMATION_TYPE } from '../constants';

const SlideAnimation = ({ display, changeDisplay, runOnMount, children }) => (
  <VelocityTransitionGroup
    enter={{ animation: SLIDE_ANIMATION_TYPE.DOWN, display: changeDisplay ? display : undefined }}
    leave={{ animation: SLIDE_ANIMATION_TYPE.UP, display: changeDisplay ? display : undefined }}
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
