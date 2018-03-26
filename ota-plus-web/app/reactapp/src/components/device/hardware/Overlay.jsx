import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable, isObservableArray } from 'mobx';
import _ from 'underscore';
import DeviceHardwareReportedList from './ReportedList';
import { DeviceHardwarePackagesInstalledList } from './packages';
import Popover from 'material-ui/Popover';
import { Switch, Loader } from '../../../partials';
import { PropertiesOnDeviceList } from '../properties';
import { Form } from 'formsy-react';
import { SubHeader, SearchBar } from '../../../partials';

const noHardwareReported = "This device hasn’t reported any information about its hardware or system components yet.";

@observer
class Overlay extends Component {
    @observable hardwareInfoShown = true;

    constructor(props) {
        super(props);
        this.showPackagesList = this.showPackagesList.bind(this);
        this.showHardwareInfo = this.showHardwareInfo.bind(this);
        this.changeHardwareFilter = this.changeHardwareFilter.bind(this);
        this.changePackagesFilter = this.changePackagesFilter.bind(this);
    }
    componentWillMount() {
        this.props.hardwareStore.fetchHardware(this.props.device.uuid);
        this.props.packagesStore.fetchOndevicePackages(this.props.device.uuid);
        this.props.packagesStore.fetchBlacklist();
    }
    showPackagesList(e) { 
        if(e) e.preventDefault();
        this.hardwareInfoShown = false;
        this.changePackagesFilter('');
    }
    showHardwareInfo(e) {
        if(e) e.preventDefault();
        this.hardwareInfoShown = true;
        this.changeHardwareFilter('');
    }
    changeHardwareFilter(filter) {
        this.props.hardwareStore._filterHardware(filter);
    }
    changePackagesFilter(filter) {
        this.props.packagesStore.fetchOndevicePackages(this.props.device.uuid, filter);
    }
    render() {
        const { hardwareStore, hideHardwareOverlay, shown, packagesStore, device, showPackageBlacklistModal, onFileDrop, hardwareOverlayAnchor } = this.props;
        let content = (
            hardwareStore.hardwareFetchAsync.isFetching ?
                <div className="wrapper-center">
                    <Loader />
                </div>
            : (isObservableArray(hardwareStore.hardware) ? !hardwareStore.hardware.length : !Object.keys(hardwareStore.hardware).length) ?
                <div className="wrapper-center">
                    {noHardwareReported}
                </div>
            :
                <div id="hardware-overlay">
                    <SubHeader>
                        <div className="nav">
                            <div className={"item" + (this.hardwareInfoShown ? " active" : "")} onClick={this.showHardwareInfo}>
                                <span>
                                    Hardware
                                </span>
                            </div>
                            <div className={"item" + (!this.hardwareInfoShown ? " active" : "")} onClick={this.showPackagesList}>
                                <span>
                                    Packages
                                </span>
                            </div>
                        </div>
                        <Form>
                            {this.hardwareInfoShown ?
                                <SearchBar
                                    value={hardwareStore.hardwareFilter}
                                    changeAction={this.changeHardwareFilter}
                                    id="search-installed-hardware-input"
                                    additionalClassName="white"
                                />
                            :
                                <SearchBar
                                    value={packagesStore.ondeviceFilter}
                                    changeAction={this.changePackagesFilter}
                                    id="search-installed-packages-input"
                                    additionalClassName="white"
                                />
                            }
                            
                        </Form>
                    </SubHeader>
                    {this.hardwareInfoShown ?                        
                        <div className="hardware-details">
                            <DeviceHardwareReportedList
                                hardware={hardwareStore.filteredHardware}
                            />
                        </div>
                    :
                        <div className="packages-details">
                            <DeviceHardwarePackagesInstalledList
                                packagesStore={packagesStore}
                                device={device}
                                showPackageBlacklistModal={showPackageBlacklistModal}
                                onFileDrop={onFileDrop}
                            />
                        </div>
                    }                    
                </div>
        );
        return (
            <Popover
                className="hardware-overlay-modal"
                open={shown}
                anchorEl={hardwareOverlayAnchor}
                anchorOrigin={{horizontal: 'right', vertical: 'center'}}
                targetOrigin={{horizontal: 'left', vertical: 'center'}}
                useLayerForClickAway={false}
                animated={false}
            >
                <div className="triangle"></div>
                <div className="content">
                    <div>
                        <div className="heading">
                            <div className="internal">
                                Reports by this ECU
                            </div>
                        </div>
                        <div className="body">
                            {content}
                            <div className="body-actions">
                                <a href="#" className="btn-primary" onClick={hideHardwareOverlay}>
                                    Close
                                </a>
                            </div>
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