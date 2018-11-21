import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import InstallationEvents from '../InstallationEvents';
import _ from 'underscore';
import Loader from "../../../partials/Loader";

@inject("stores")
@observer
class MtuListItem extends Component {

    render() {
        const { update, cancelMtuUpdate, showSequencer, events } = this.props;
        const { devicesStore } = this.props.stores;
        const { device } = devicesStore;
        const devicePrimaryEcu = device.directorAttributes.primary;
        const deviceSecondaryEcus = device.directorAttributes.secondary;
        const { correlationId, targets, campaign } = update;
        let type = campaign ? 'campaign' : 'singleInstallation';

        return (
            <li className="overview-panel__item">
                {type === 'campaign' ?
                    <div className="overview-panel__item-header">
                        <div className="overview-panel__item-header--title overview-panel__item-header--title__queue">
                            <div>
                                <span id={"update-id-title-" + correlationId} className="overview-panel__item-header--title__label">
                                    Campaign:
                                </span>
                                <span id={"update-id-" + correlationId}>
                                    {campaign.name}
                                </span>
                            </div>
                            <div>
                                <button id="cancel-mtu" className="overview-panel__cancel-update" onClick={cancelMtuUpdate.bind(this, correlationId)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                        <div className="overview-panel__item-header--update">
                            <div className="overview-panel__item-header--update__name">
                                <span id={"update-id-title-" + correlationId} className="overview-panel__item-header__label">
                                    Update&nbsp;name:
                                </span>
                                <span id={"update-id-" + correlationId}>
                                    {campaign.update.name}
                                </span>
                            </div>
                            <div className="overview-panel__item-header--update__description">
                                <span id={"update-id-title-" + correlationId} className={'overview-panel__item-header__label'}>
                                    Update&nbsp;description:
                                </span>
                                <span id={"update-id-" + correlationId}>
                                    {campaign.update.description}
                                </span>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="overview-panel__item-header">
                        <div className="overview-panel__item-header--title overview-panel__item-header--title__queue">
                            <div>
                                <span id={"update-id-title-" + correlationId} className="overview-panel__item-header--title__label">
                                    Single-device update
                                </span>
                            </div>
                            <div>
                                <button id="cancel-mtu" className="overview-panel__cancel-update" onClick={cancelMtuUpdate.bind(this, correlationId)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                }
                <div className="overview-panel__operations">
                    {_.map(targets, (target, serial) => {
                        let hardwareId = null;
                        if (devicePrimaryEcu.id === serial) {
                            hardwareId = devicePrimaryEcu.hardwareId;
                        }
                        const serialFromSecondary = _.find(deviceSecondaryEcus, ecu => ecu.id === serial);
                        if (serialFromSecondary) {
                            hardwareId = serialFromSecondary.hardwareId;
                        }
                        const hash = target.image.fileinfo.hashes.sha256;
                        const filepath = target.image.filepath;
                        const length = target.image.fileinfo.length;
                        return (
                            <div className="overview-panel__operation overview-panel__operation__queued" key={hash}>
                                <div className="overview-panel__label overview-panel__label--queued">Queued</div>
                                <div className="overview-panel__operation-info">
                                    <div className="overview-panel__operation-info-line">
                                        <div className="overview-panel__operation-info-block">
                                            <span id={"ecu-serial-title-" + correlationId} className="overview-panel__operation-info--label">
                                                ECU&nbsp;type:
                                            </span>
                                            <span id={"ecu-serial-" + correlationId}>
                                                {hardwareId}
                                            </span>
                                        </div>
                                        <div className="overview-panel__operation-info-block">
                                             <span id={"ecu-serial-title-" + correlationId} className="overview-panel__operation-info--label">
                                                ECU&nbsp;identifier:
                                            </span>
                                            <span id={"ecu-serial-" + correlationId}>
                                                {serial}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overview-panel__operation-info-line">
                                        <div className="overview-panel__operation-info-block">
                                            <span id={"target-title-" + correlationId} className="overview-panel__operation-info--label">
                                                Target:
                                            </span>
                                            <span id={"target-" + correlationId}>
                                                {filepath}
                                            </span>
                                        </div>
                                        {length !== 0 ?
                                            <div className="overview-panel__operation-info-block">
                                                <span id={"length-title-" + correlationId} className="overview-panel__operation-info--label">
                                                    Length:
                                                </span>
                                                <span id={"length-" + correlationId}>
                                                    {length.toLocaleString()} bytes
                                                </span>
                                            </div>
                                            :
                                            <div className="overview-panel__operation-info-block"></div>
                                        }
                                        </div>
                                    {events.length ?
                                        devicesStore.eventsFetchAsync.isFetching ?
                                            <div className="wrapper-center">
                                                <Loader/>
                                            </div>
                                            :
                                            <InstallationEvents
                                                events={events}
                                            />
                                        :
                                        null
                                    }
                                </div>
                            </div>
                        )
                    })
                    }
                </div>
            </li>
        );
    }
}

MtuListItem.propTypes = {
    stores: PropTypes.object
}

export default MtuListItem;