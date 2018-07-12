import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { Dropdown } from '../../partials';

const deviceSource = {
    beginDrag(props) {
        const foundGroup = _.find(props.groupsStore.groups, (group) => {
            return group.devices.values.indexOf(props.device.uuid) > -1;
        });
        return {
            uuid: props.device.uuid,
            groupId: foundGroup ? foundGroup.id : null,
        };
    },
    endDrag(props, monitor) {
        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();
        let selectedGroup = props.groupsStore.selectedGroup;
        if(selectedGroup.id) {
            props.devicesStore.fetchDevices('', selectedGroup.id);
        } else {
            props.devicesStore.fetchDevices();
        }
    },
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    };
}

@observer
class Item extends Component {
    @observable menuShown = false;

    constructor(props) {
        super(props);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.hideMenu = this.hideMenu.bind(this);
    }
    toggleMenu(e) {
        e.stopPropagation();
        this.menuShown = !this.menuShown;
    }
    hideMenu(e) {
        this.menuShown = false;
    }
    render() {
        const { groupsStore, device, goToDetails, alphaPlusEnabled, showDeleteConfirmation, showEditName } = this.props;
        const { isDragging, connectDragSource } = this.props;
        const opacity = isDragging ? 0.4 : 1;
        const lastSeenDate = new Date(device.lastSeen);
        let deviceStatus = 'Status unknown';
        switch(device.deviceStatus) {
            case 'UpToDate':
                deviceStatus = 'Device synchronized';
            break;
            case 'Outdated':
                deviceStatus = 'Device unsynchronized';
            break;
            case 'Error':
                deviceStatus = 'Installation error';
            break;
            default:
            break;
        }
        
        let foundGroup = null;
        let foundFleet = null;
        if(!groupsStore.groupsFetchAsync.isFetching) {
            foundGroup = _.find(groupsStore.groups, (group) => {
                return group.devices.values.indexOf(device.uuid) > -1;
            });
            foundFleet = foundGroup ? foundGroup.fleet_id : null;
        }
        return (
            connectDragSource(
                <div className="devices-panel__device">
                    <div className="hover-area" style={{opacity}} onClick={goToDetails.bind(this, device.uuid)} id={"link-devicedetails-" + device.uuid} />
                    <div className="dots align" id={"device-actions-" + device.uuid} onClick={this.toggleMenu}>
                        <div className="dots__wrapper">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    <Dropdown
                        show={this.menuShown}
                        hideSubmenu={this.hideMenu}
                        customClassName={"align"}
                    >
                        <li className="device-dropdown-item">
                            <a className="device-dropdown-item" id="edit-device" onClick={showEditName.bind(this, device)} >
                                <img src="/assets/img/icons/edit_icon.svg" alt="Icon" />
                                Edit device
                            </a>
                        </li>
                        <li className="device-dropdown-item">
                            <a className="device-dropdown-item" id="delete-device" onClick={showDeleteConfirmation.bind(this, device)} >
                                <img src="/assets/img/icons/trash_icon.svg" alt="Icon" />
                                Delete device
                            </a>
                        </li>
                    </Dropdown>
                    {alphaPlusEnabled && foundFleet ?
                        <div className={"devices-panel__device-icon devices-panel__device-icon--" + foundFleet}>
                            <div className={"device-status device-status--" + device.deviceStatus} title={deviceStatus}></div>
                        </div>
                    :
                        <div className="devices-panel__device-icon">
                            <div className={"device-status device-status--" + device.deviceStatus} title={deviceStatus}></div>
                        </div>
                    }
                    <div className="devices-panel__device-desc">
                        <div className="devices-panel__device-title" title={device.deviceName}>
                            {device.deviceName}
                        </div>
                        <div className="devices-panel__device-subtitle">
                            {deviceStatus !== 'Status unknown' ?
                                <span>Last seen: {lastSeenDate.toDateString() + ' ' + lastSeenDate.toLocaleTimeString()}</span>
                            :
                                <span>Never seen online</span>
                            }
                        </div>
                        <div className="devices-panel__device-subtitle">{foundGroup ? "Group: " + foundGroup.groupName : "Ungrouped"}</div>
                    </div>
                </div>
            )
        );
    }
}

Item.propTypes = {
    groupsStore: PropTypes.object.isRequired,
    devicesStore: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired,
    goToDetails: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
}

export default DragSource('device', deviceSource, collect)(Item);
