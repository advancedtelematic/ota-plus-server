import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { RaisedButton, Popover } from 'material-ui';
import CopyToClipboard from 'react-copy-to-clipboard';
import { VelocityTransitionGroup } from 'velocity-react';

@observer
class PopoverWrapper extends Component {
    @observable popoverShown = false;
    @observable anchorEl = null;
    @observable copied = false;

    constructor(props) {
        super(props);
        this.handleTouchTap = this.handleTouchTap.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleCopy = this.handleCopy.bind(this);
    }
    handleTouchTap(e) {
        e.preventDefault();
        e.stopPropagation();
        const { onOpen } = this.props;
        this.anchorEl = e.currentTarget;
        this.popoverShown = true;
        if(onOpen)
            onOpen();
    }
    handleRequestClose() {
        const { onClose } = this.props;
        this.popoverShown = false;
        this.copied = false;
        if(onClose)
            onClose();
    }
    handleCopy() {
        this.copied = true;
    }
    render() {
        const { children } = this.props;
        const props = children.props;
        return (
            <span>
                <children.type
                    handleTouchTap={this.handleTouchTap}
                    handleRequestClose={this.handleRequestClose}
                    handleCopy={this.handleCopy}
                    popoverShown={this.popoverShown}
                    anchorEl={this.anchorEl}
                    copied={this.copied}
                    {...props}
                />
            </span>
        );
    }
}

PopoverWrapper.propTypes = {
    children: PropTypes.element.isRequired,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
};

export default PopoverWrapper;
