import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import { observer } from 'mobx-react';
import _ from 'underscore';

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
    constructor(props) {
        super(props);
    }
    render() {
        const { groupsStore, device, goToDetails } = this.props;
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
        const foundGroup = _.find(groupsStore.groups, (group) => {
            return group.devices.values.indexOf(device.uuid) > -1;
        });
        return (
            connectDragSource(
                <div className="common-box" style={{opacity}} onClick={goToDetails.bind(this, device.uuid)} id={"link-devicedetails-" + device.uuid}>
                    <div className="icon">
                        <div className={"device-status device-status-" + device.deviceStatus} title={deviceStatus}></div>
                    </div>
                    <div className="desc">
                        <div className="title" title={device.deviceName}>{device.deviceName}</div>
                        <div className="subtitle">
                            {deviceStatus !== 'Status unknown' ?
                                <span>Last seen: {lastSeenDate.toDateString() + ' ' + lastSeenDate.toLocaleTimeString()}</span>
                            :
                                <span>Never seen online</span>
                            }
                        </div>
                        <div className="subtitle">{foundGroup ? "Group: " + foundGroup.groupName : "Ungrouped"}</div>
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
