import React, { Component, PropTypes } from 'react';
import { observer, observable } from 'mobx-react';
import _ from 'underscore';
import DeviceHardwareOverlayItem from './OverlayItem';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
@observer
class Overlay extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { hardware, hideDetails, shown } = this.props;
        let content = null;

        if(_.isEmpty(hardware)) {
            content = (
                <div className="wrapper-center">
                    This device hasn’t reported any information about
                    its hardware or system components yet.
                </div>
            );
        } else {
            content = (
                <div id="hardware-overlay">

                    <div className="details">
                        <DeviceHardwareOverlayItem
                            hardware={hardware}
                            mainLevel={true}
                        />
                    </div>
                </div>
            );
        }

        return (
                <Popover
                    className="hardware-overlay-modal"
                    open={shown}
                    anchorEl={this.detailsIdShown}
                    anchorOrigin={{horizontal: 'right', vertical: 'center'}}
                    targetOrigin={{horizontal: 'left', vertical: 'center'}}
                    onRequestClose={hideDetails}
                    useLayerForClickAway={false}
                    animation={PopoverAnimationVertical}
                >
                    <div className="triangle"></div>
                    <div className="content">
                        <div>
                            <img src="/assets/img/icons/chip.png" className="heading" alt="" style={{width: '90px'}}/>
                            <div className="body">
                                {content}
                            </div>
                        </div>
                    </div>
                </Popover>
        );
    }
}

Overlay.propTypes = {
    hardware: PropTypes.object.isRequired,
    hideDetails: PropTypes.func.isRequired,
    shown: PropTypes.bool.isRequired,
}

export default Overlay;