import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import DeviceHardwareOverlayItem from './OverlayItem';
import Popover from 'material-ui/Popover';
import { Switch } from '../../../partials';
import { PropertiesOnDeviceList } from '../properties';

@observer
class Overlay extends Component {
    @observable hardwareInfoShown = true;

    constructor(props) {
        super(props);
        this.showPackagesList = this.showPackagesList.bind(this);
        this.showHardwareInfo = this.showHardwareInfo.bind(this);
    }
    showPackagesList(e) {
        if(e) e.preventDefault();
        this.hardwareInfoShown = false;
    }
    showHardwareInfo(e) {
        if(e) e.preventDefault();
        this.hardwareInfoShown = true;
    }
    render() {
        const { hardware, hideHardwareOverlay, shown, packagesStore, device, showPackageBlacklistModal, onFileDrop, hardwareOverlayAnchor } = this.props;
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
                        <Switch
                            hardwareInfoShown={this.hardwareInfoShown}
                            showHardwareInfo={this.showHardwareInfo}
                            showPackagesList={this.showPackagesList}
                        />
                        {this.hardwareInfoShown ?
                            <div className="hardware-details">
                                <DeviceHardwareOverlayItem
                                    hardware={hardware}
                                    mainLevel={true}
                                />
                            </div>
                        :
                            <div className="packages-details">
                                <PropertiesOnDeviceList
                                    packagesStore={packagesStore}
                                    device={device}
                                    showPackageBlacklistModal={showPackageBlacklistModal}
                                    onFileDrop={onFileDrop}
                                />
                            </div>
                        }
                    </div>
                </div>
            );
        }
        return (
                <Popover
                    className="hardware-overlay-modal"
                    open={shown}
                    anchorEl={hardwareOverlayAnchor}
                    anchorOrigin={{horizontal: 'right', vertical: 'center'}}
                    targetOrigin={{horizontal: 'left', vertical: 'center'}}
                    onRequestClose={hideHardwareOverlay}
                    useLayerForClickAway={false}
                    animated={false}
                >
                    <div className="triangle"></div>
                    <div className="content">
                        <div>
                            <div className="heading">
                                {this.hardwareInfoShown ?
                                    <span>
                                        Hardware reported by this ECU
                                    </span>
                                :
                                    <span>
                                        Packages reported by this ECU
                                    </span>
                                }
                            </div>
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
    hardware: PropTypes.object,
    hideHardwareOverlay: PropTypes.func.isRequired,
    shown: PropTypes.bool.isRequired,
}

export default Overlay;