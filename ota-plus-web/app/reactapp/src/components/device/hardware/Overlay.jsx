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
        this.changeFilter = this.changeFilter.bind(this);
    }
    componentWillMount() {
        this.props.hardwareStore.fetchHardware(this.props.device.uuid);
        this.props.packagesStore.fetchOndevicePackages(this.props.device.uuid);
        this.props.packagesStore.fetchBlacklist();
    }
    showPackagesList(e) { 
        if(e) e.preventDefault();
        this.hardwareInfoShown = false;
    }
    showHardwareInfo(e) {
        if(e) e.preventDefault();
        this.hardwareInfoShown = true;
        this.changeFilter('');
    }
    changeFilter(filter) {
        this.props.hardwareStore._filterHardware(filter);
    }
    render() {
        const { hardwareStore, hideHardwareOverlay, shown, packagesStore, device, showPackageBlacklistModal, onFileDrop, hardwareOverlayAnchor } = this.props;
        let content = (
            hardwareStore.hardwareFetchAsync.isFetching || packagesStore.initialPackagesForDeviceFetchAsync.isFetching ?
                <div className="wrapper-center">
                    <Loader />
                </div>
            : (isObservableArray(hardwareStore.hardware) ? !hardwareStore.hardware.length : !Object.keys(hardwareStore.hardware).length) ?
                <div className="wrapper-center">
                    {noHardwareReported}
                </div>
            :
                <div id="hardware-overlay">
                    <div className="details">
                        <Switch
                            hardwareInfoShown={this.hardwareInfoShown}
                            showHardwareInfo={this.showHardwareInfo}
                            showPackagesList={this.showPackagesList}
                        />
                        {this.hardwareInfoShown ?
                            <div className="hardware-details">
                                <SubHeader>
                                    <Form>
                                        <SearchBar
                                            value={hardwareStore.hardwareFilter}
                                            changeAction={this.changeFilter}
                                            id="search-installed-hardware-input"
                                        />
                                    </Form>
                                </SubHeader>
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
                </div>
        );
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