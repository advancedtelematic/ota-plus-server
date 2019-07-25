import React, { Component } from 'react';
import AnimateHeight from 'react-animate-height';
import PropTypes from 'prop-types';

const INITIAL_HEIGHT = 0;
const ANIMATION_DURATION = 250;
const ANIMATION_HIDE_DELAY = 1000;

class OperationCompletedInfo extends Component {
  constructor(props) {
    super(props);
    this.state = { height: INITIAL_HEIGHT, trigger: { name: undefined, createdAt: undefined } };
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

  render() {
    const { info } = this.props;
    const { height } = this.state;
    return (
      <AnimateHeight
        duration={ANIMATION_DURATION}
        height={height}
        className="AnimateHeight"
        onAnimationEnd={() => {
          setTimeout(() => {
            this.setState({ height: INITIAL_HEIGHT });
          }, ANIMATION_HIDE_DELAY);
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
  info: ''
};

OperationCompletedInfo.propTypes = {
  info: PropTypes.string,
  trigger: PropTypes.shape({}).isRequired
};

export default OperationCompletedInfo;
