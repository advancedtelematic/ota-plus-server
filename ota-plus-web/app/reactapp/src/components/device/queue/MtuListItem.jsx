import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import InstallationEvents from '../InstallationEvents';
import _ from 'underscore';

@inject("stores")
@observer
class MtuListItem extends Component {
    render() {
        const { item, serial, updateId, status, length, cancelMtuUpdate, showSequencer } = this.props;
        const { featuresStore, devicesStore } = this.props.stores;
        const { alphaTestEnabled } = featuresStore;
        const { device } = devicesStore;
        const devicePrimaryEcu = device.directorAttributes.primary;
        const deviceSecondaryEcus = device.directorAttributes.secondary;

        let hardwareId = null;
        if(devicePrimaryEcu.id === serial) {
            hardwareId = devicePrimaryEcu.hardwareId;
        }
        const serialFromSecondary = _.find(deviceSecondaryEcus, ecu => ecu.id === serial)
        if(serialFromSecondary) {
            hardwareId = serialFromSecondary.hardwareId;
        }

        const hash = item.image.fileinfo.hashes.sha256;
        return (
            <li id={"queued-entry-" + hash} className="overview-panel__item">

                <div className="overview-panel__item-header">
                    <div className="overview-panel__item-update">
                        <div>
                            <span id={"update-id-title-" + updateId} className="overview-panel__item-title">
                                Update ID
                            </span>
                            <span id={"update-id-" + updateId}>
                                {updateId}
                            </span>
                        </div>
                        <div>
                            <button id="cancel-mtu" className="overview-panel__cancel-update" onClick={cancelMtuUpdate.bind(this, updateId)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                    <div className="overview-panel__item-process-status">
                        {status === "waiting" ?
                            <span>Queued, waiting for device to connect</span>
                            : status === "downloading" ?
                                <span>Waiting for download to complete</span>
                                : status === "installing" ?
                                    <span>Waiting for installation to complete</span>
                                    :
                                    null
                        }
                        <img src="/assets/img/icons/points.gif" className="overview-panel__process-dots" alt="Icon" />
                    </div>
                </div>

                <div className="overview-panel__operations">
                    <div className="overview-panel__operation">
                        <div className="overview-panel__operation-info">
                            <div className="overview-panel__operation-info-block">
                                <span id={"ecu-serial-title-" + updateId} className="overview-panel__operation-info-title">
                                    ECU Serial:
                                </span>
                                <span id={"ecu-serial-" + updateId}>
                                    {serial}
                                </span>
                            </div>
                            <div className="overview-panel__operation-info-block">
                                <span id={"ecu-serial-title-" + updateId} className="overview-panel__operation-info-title">
                                    Hardware id:
                                </span>
                                <span id={"ecu-serial-" + updateId}>
                                    {hardwareId}
                                </span>
                            </div>
                            <div className="overview-panel__operation-info-block">
                                <span id={"target-title-" + updateId} className="overview-panel__operation-info-title">
                                    Target:
                                </span>
                                <span id={"target-" + updateId}>
                                    {hash}
                                </span>
                            </div>
                            {/*hidden until result.length is available// hidden until result.length is available*/}
                            {/*<div className="overview-panel__operation-info-block">*/}
                                {/*<span id={"length-title-" + updateId} className="overview-panel__operation-info-title">*/}
                                    {/*Length:*/}
                                {/*</span>*/}
                                {/*<span id={"length-" + updateId}>*/}
                                    {/*{length}*/}
                                {/*</span>*/}
                            {/*</div>*/}
                            {alphaTestEnabled ?
                                <InstallationEvents
                                    updateId={updateId}
                                    error={null}
                                    queue={true}
                                />
                                :
                                null
                            }
                        </div>
                        <div className="overview-panel__pending-status">
                            <span className="overview-panel__text">{"Installation pending"}</span>
                        </div>
                    </div>
                </div>
            </li>
        );
    }
}

MtuListItem.propTypes = {
    stores: PropTypes.object
}

export default MtuListItem;