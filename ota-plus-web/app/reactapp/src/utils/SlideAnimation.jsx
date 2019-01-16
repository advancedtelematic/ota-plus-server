/** @format */

import React, { Component, PropTypes, defaultProps } from 'react';
import { VelocityTransitionGroup } from 'velocity-react';

class SlideAnimation extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { display, changeDisplay, runOnMount } = this.props;
    return (
      <VelocityTransitionGroup
        enter={{ animation: 'slideDown', display: changeDisplay ? display : undefined }}
        leave={{ animation: 'slideUp', display: changeDisplay ? display : undefined }}
        runOnMount={runOnMount}
      >
        {this.props.children}
      </VelocityTransitionGroup>
    );
  }
}

SlideAnimation.propTypes = {
  display: PropTypes.string,
  changeDisplay: PropTypes.bool,
  runOnMount: PropTypes.bool,
};

SlideAnimation.defaultProps = {
  display: 'inherit',
  changeDisplay: true,
  runOnMount: true,
};

export default SlideAnimation;
