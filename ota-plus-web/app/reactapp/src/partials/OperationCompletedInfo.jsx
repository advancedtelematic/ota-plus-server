import React, { Component } from 'react';
import AnimateHeight from 'react-animate-height';
import PropTypes from 'prop-types';

const INITIAL_HEIGHT = 0;
const ANIMATION_DURATION = 250;
const ANIMATION_HIDE_DELAY = 1000;

class OperationCompletedInfo extends Component {
  constructor(props) {
    super(props);
    const { initialHeight } = props;
    this.state = { height: initialHeight, trigger: { name: undefined, createdAt: undefined } };
  }

  componentWillReceiveProps(nextProps) {
    const { trigger: { name, createdAt } } = nextProps;
    const { trigger } = this.state;
    if (createdAt !== trigger.createdAt || (!trigger.name && name)) {
      this.setState({
        height: 'auto',
        trigger: {
          name,
          createdAt
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  render() {
    const { hidden, info, preserve } = this.props;
    const { height } = this.state;
    return (
      <AnimateHeight
        duration={ANIMATION_DURATION}
        height={hidden ? 0 : height}
        className="AnimateHeight"
        onAnimationEnd={() => {
          if (!preserve) {
            this.animationInterval = setTimeout(() => {
              this.setState({ height: INITIAL_HEIGHT });
            }, ANIMATION_HIDE_DELAY);
          }
        }}
      >
        <div className="anim-info">
          <div className="text">
            {info}
          </div>
        </div>
      </AnimateHeight>
    );
  }
}

OperationCompletedInfo.defaultProps = {
  hidden: false,
  info: '',
  initialHeight: INITIAL_HEIGHT,
  preserve: false,
  trigger: {}
};

OperationCompletedInfo.propTypes = {
  hidden: PropTypes.bool,
  info: PropTypes.string,
  initialHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  preserve: PropTypes.bool,
  trigger: PropTypes.shape({})
};

export default OperationCompletedInfo;
