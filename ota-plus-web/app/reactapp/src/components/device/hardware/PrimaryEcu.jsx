import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import PublicKeyPopover from './PublicKeyPopover';

@observer
class PrimaryEcu extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { ecu, toggle, toggled, ...otherProps } = this.props;
        return (
            <button
                className="primary"
                onClick={toggle}
            >
                <i className={"fa " + (toggled ? "fa-chevron-down" : "fa-chevron-right")} aria-hidden="true"></i>
                {ecu.image.filepath}
                <div
                    className={"popover-icon" + (otherProps.popoverShown ? " active" : "")}
                    onTouchTap={otherProps.handleTouchTap}
                    onClick={(e) => {e.stopPropagation()}}>
                    PK
                    <PublicKeyPopover
                        {...otherProps}
                        ecu={ecu}
                    />
                </div>
            </button>
        );
    }
}

PrimaryEcu.propTypes = {
    ecu: PropTypes.object.isRequired,
    toggle: PropTypes.func.isRequired,
    toggled: PropTypes.bool.isRequired,
    handleCopy: PropTypes.func,
    handleRequestClose: PropTypes.func,
    handleTouchTap: PropTypes.func,
    popoverShown: PropTypes.bool,
    copied: PropTypes.bool,
};

export default PrimaryEcu;
