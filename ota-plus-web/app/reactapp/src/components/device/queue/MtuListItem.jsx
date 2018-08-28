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
        const { alphaPlusEnabled } = featuresStore;
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
            <li id={"queued-entry-" + hash} className="queue-modal__item">

                <div className="queue-modal__item-header">
                    <div className="queue-modal__item-update">
                        <div>
                            <span id={"update-id-title-" + updateId} className="queue-modal__item-title">
                                Update ID
                            </span>
                            <span id={"update-id-" + updateId}>
                                {updateId}
                            </span>
                        </div>
                        <div>
                            <button id="cancel-mtu" className="queue-modal__cancel-update" onClick={cancelMtuUpdate.bind(this, updateId)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                    <div className="queue-modal__item-process-status">
                        {status === "waiting" ?
                            <span>Queued, waiting for device to connect</span>
                        : status === "downloading" ?
                            <span>Waiting for download to complete</span>
                        : status === "installing" ?
                            <span>Waiting for installation to complete</span>
                        :
                            null
                        }
                        <img src="/assets/img/icons/points.gif" className="queue-modal__process-dots" alt="Icon" />
                    </div>
                </div>

                <div className="queue-modal__operations">
                    <div className="queue-modal__operation">
                        <div className="queue-modal__operation-info">
                            <div className="queue-modal__operation-info-block">
                                <span id={"ecu-serial-title-" + updateId} className="queue-modal__operation-info-title">
                                    ECU Serial:
                                </span>
                                <span id={"ecu-serial-" + updateId}>
                                    {serial}
                                </span>
                            </div>
                            <div className="queue-modal__operation-info-block">
                                <span id={"ecu-serial-title-" + updateId} className="queue-modal__operation-info-title">
                                    Hardware id:
                                </span>
                                <span id={"ecu-serial-" + updateId}>
                                    {hardwareId}
                                </span>
                            </div>
                            <div className="queue-modal__operation-info-block">
                                <span id={"target-title-" + updateId} className="queue-modal__operation-info-title">
                                    Target:
                                </span>
                                <span id={"target-" + updateId}>
                                    {hash}
                                </span>
                            </div>
                            <div className="queue-modal__operation-info-block">
                                <span id={"length-title-" + updateId} className="queue-modal__operation-info-title">
                                    Length:
                                </span>
                                <span id={"length-" + updateId}>
                                    {length}
                                </span>
                            </div>
                            {alphaPlusEnabled ?
                                <InstallationEvents 
                                    updateId={updateId}
                                    error={null}
                                    queue={true}
                                />
                            :
                                null
                            }
                            
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