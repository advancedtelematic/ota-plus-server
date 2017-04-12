import React, { Component, PropTypes } from 'react';
import 'velocity-animate';
import 'velocity-animate/velocity.ui';
import { VelocityTransitionGroup, velocityHelpers } from 'velocity-react';

const Animation = {
    up: velocityHelpers.registerEffect({
        defaultDuration: 1200,
        calls: [
            [{
                translateY: '-100%'
            }]
        ],
    }),
    down: velocityHelpers.registerEffect({
        defaultDuration: 600,
        calls: [
            [{
                translateY: '100%'
            }]
        ],
    }),
};

class DoorAnimation extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { mode } = this.props;
        return (
            <span>
                {mode === 'hide' ? 
                    <VelocityTransitionGroup 
                        enter={{
                            animation: Animation.down, 
                            complete: () => {
                                window.location.href = logoutUrl
                            }
                        }} 
                        runOnMount={true}>
                        <div className="door up"></div>
                    </VelocityTransitionGroup>
                :
                    <VelocityTransitionGroup 
                        enter={{animation: Animation.up}} 
                        runOnMount={true}>
                        <div className="door"></div>
                    </VelocityTransitionGroup>
                }
            </span>
        );
    }
}

DoorAnimation.propTypes = {
    mode: PropTypes.string.isRequired
}

export default DoorAnimation;