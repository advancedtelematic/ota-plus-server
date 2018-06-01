import React, { Component, PropTypes, defaultProps } from 'react';
import { VelocityTransitionGroup } from 'velocity-react';

class FadeAnimation extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { runOnMount } = this.props;
        return (
            <VelocityTransitionGroup component="span" enter={{animation: "fadeIn", display: this.props.display}} leave={{animation: "fadeOut", display: this.props.display}} runOnMount={runOnMount}>
                {this.props.children}
            </VelocityTransitionGroup>
        );
    }
}

FadeAnimation.propTypes = {
    display: PropTypes.string
}

FadeAnimation.defaultProps = {
    display: "inherit",
    runOnMount: true
}

export default FadeAnimation;