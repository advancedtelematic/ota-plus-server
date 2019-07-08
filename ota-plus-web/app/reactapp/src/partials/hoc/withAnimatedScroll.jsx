/* eslint-disable no-param-reassign */
/** @format */

import React from 'react';

function withAnimatedScroll(WrappedComponent) {
  return class extends React.Component {
    animatedScroll = (element, to, duration) => {
      const start = element.scrollTop;
      const change = to - start;
      let currentTime = 0;
      const increment = 20;

      Math.easeInOutQuad = function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t -= 1;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      };

      const animateScroll = function () {
        currentTime += increment;
        const val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if (currentTime < duration) {
          setTimeout(animateScroll, increment);
        }
      };
      animateScroll();
    };

    render() {
      return <WrappedComponent animatedScroll={this.animatedScroll} {...this.props} />;
    }
  };
}

export default withAnimatedScroll;
