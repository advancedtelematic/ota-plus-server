import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Popover } from 'material-ui';
import _ from 'underscore';

import Content from "./FeatureContent";
import {
    WHATS_NEW_DEFAULT_ACTIONS,
} from '../../../config';


@observer
class FeaturePopover extends Component {

    renderButtons = () => {
        const { step, callback, buttons } = this.props;
        const labels = buttons || WHATS_NEW_DEFAULT_ACTIONS;
        const initialStep = !step.previous;
        const finalStep = !step.next;

        const actions =
            initialStep ? ["deny", "delay", "next"]
                :
                finalStep ? ["back", "summary", "close"]
                    :
                    _.map(WHATS_NEW_DEFAULT_ACTIONS, action => action.toLowerCase());

        return (
            _.map(actions, (action, index) => {
                const validAction = !_.isUndefined(action);
                return validAction &&
                    <button
                        key={ index }
                        className={ `col-xs-4 btn-${(index === 2) ? 'primary' : 'bordered'}` }
                        id={ `button-${action}` }
                        onClick={ () => callback(action) }
                    ><span className={`btn-${(index === 2) ? 'primary' : 'bordered'}__label`}>{ labels[index] }</span>
                    </button>
            })
        );
    };

    render() {
        const {
            feature,
            step,
            totalSteps,
        } = this.props;
        const initialStep = !step.previous;
        const classPopover = initialStep ? ' initial' : ' started';

        return (
            <Popover
                className={ "popover-modal whats-new shadow" + classPopover }
                open={ true }
                anchorEl={ this.props.anchor }
                anchorOrigin={ { horizontal: 'right', vertical : 'center' } }
                targetOrigin={ { horizontal: 'left', vertical: 'center' } }
                onRequestClose={ this.reset }
                useLayerForClickAway={ false }
                animated={ false }
            >
                <div className="popover-modal__triangle"/>
                <div className="popover-modal__headline"><h4>{ `Step ${step.order}/${totalSteps}` }</h4></div>
                <div className="popover-modal__body">
                    <Content data={ feature }/>
                </div>
                <div className="popover-modal__actions">
                    { this.renderButtons() }
                </div>
            </Popover>
        )
    }
}

FeaturePopover.propTypes = {
    feature: PropTypes.object.isRequired,
    callback: PropTypes.func.isRequired,
    step: PropTypes.object.isRequired,
    totalSteps: PropTypes.number,
    anchor: PropTypes.object,
};

export default FeaturePopover;