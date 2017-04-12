import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import PublicKeyPopover from './PublicKeyPopover';

@observer
class EcusListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { hardwareStore, ecu, selectedEcuId, selectEcu, deviceId, ...otherProps } = this.props;
        return (
            <button
                className={selectedEcuId === ecu.id ? "active" : ""}
                onClick={selectEcu.bind(this, ecu.id)}
            >
                {ecu.image.filepath}
                <div
                    className={"popover-icon" + (otherProps.popoverShown ? " active" : "")}
                    onTouchTap={otherProps.handleTouchTap}
                    onClick={(e) => {e.stopPropagation()}}>
                    PK
                    <PublicKeyPopover
                        {...otherProps}
                        hardwareStore={hardwareStore}
                        ecu={ecu}
                        deviceId={deviceId}
                    />
                </div>
            </button>
        );
    }
}

EcusListItem.propTypes = {
    hardwareStore: PropTypes.object.isRequired,
    ecu: PropTypes.object.isRequired,
    selectedEcuId: PropTypes.string,
    selectEcu: PropTypes.func.isRequired,
    deviceId: PropTypes.string.isRequired,
};

export default EcusListItem;
