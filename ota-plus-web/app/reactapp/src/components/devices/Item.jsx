/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'lodash';
import { Dropdown } from '../../partials';

const deviceSource = {
  beginDrag(props) {
    const { groupsStore } = props.stores;
    const { uuid } = props.device;
    const foundClassicGroup = _.find(
      groupsStore.groups, group => group.devices.values.indexOf(uuid) > -1 && group.groupType === 'static'
    );

    return {
      uuid,
      groupId: foundClassicGroup ? foundClassicGroup.id : null,
    };
  },
  endDrag(props) {
    const { devicesStore, groupsStore } = props.stores;
    const { selectedGroup } = groupsStore;
    const groupId = selectedGroup.id || null;
    const ungrouped = groupsStore.selectedGroup.ungrouped || null;
    devicesStore.fetchDevices('', groupId, ungrouped);
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

  showMenu = (e) => {
    e.stopPropagation();
    this.menuShown = true;
  };

  hideMenu = (e) => {
    e.preventDefault();
    this.menuShown = false;
  };

  render() {
    const semiTransparent = 0.4;
    const { device, goToDetails, showDeleteConfirmation, showEditName } = this.props;
    const { uuid, deviceId, deviceName, deviceStatus, lastSeen } = device;
    const { isDragging, connectDragSource } = this.props;
    const opacity = isDragging ? semiTransparent : 1;
    const lastSeenDate = new Date(lastSeen);
    let deviceStatusMessage = 'Status unknown';
    switch (deviceStatus) {
      case 'UpToDate':
        deviceStatusMessage = 'Device synchronized';
        break;
      case 'Outdated':
        deviceStatusMessage = 'Device unsynchronized';
        break;
      case 'Error':
        deviceStatusMessage = 'Installation error';
        break;
      default:
        break;
    }

    return connectDragSource(
      <div className="devices-panel__device">
        <div
          className="hover-area"
          style={{ opacity }}
          onClick={goToDetails.bind(this, uuid)}
          id={`link-devicedetails-${uuid}-${deviceName}`}
        />
        <div className="dots align" id={`device-actions-${uuid}`} onClick={this.showMenu}>
          <div className="dots__wrapper">
            <span />
            <span />
            <span />
          </div>
        </div>
        {this.menuShown && (
          <Dropdown hideSubmenu={this.hideMenu} customClassName="align">
            <li className="device-dropdown-item">
              <a
                className="device-dropdown-item"
                id="edit-device"
                onClick={showEditName.bind(this, device)}
              >
                {'Rename device'}
              </a>
            </li>
            <li className="device-dropdown-item">
              <a
                className="device-dropdown-item"
                id="delete-device"
                onClick={showDeleteConfirmation.bind(this, device)}
              >
                {'Delete device'}
              </a>
            </li>
          </Dropdown>
        )}
        <div className="devices-panel__device-icon">
          <div className={`device-status device-status--${deviceStatus}`} title={deviceStatus} />
        </div>
        <div className="devices-panel__device-desc">
          <div className="devices-panel__device-title" title={deviceName} id={deviceName}>
            {deviceName}
          </div>
          <div className="devices-panel__device-subtitle" title={deviceId} id={deviceId}>
            ID:
            {' '}
            {deviceId}
          </div>
          <div className="devices-panel__device-subtitle">
            {deviceStatusMessage !== 'Status unknown'
              ? <span>{`Last seen: ${lastSeenDate.toDateString()} ${lastSeenDate.toLocaleTimeString()}`}</span>
              : <span>{'Never seen online'}</span>
            }
          </div>
        </div>
      </div>,
    );
  }
}

Item.propTypes = {
  stores: PropTypes.shape({}),
  device: PropTypes.shape({}).isRequired,
  goToDetails: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  showDeleteConfirmation: PropTypes.func,
  showEditName: PropTypes.func
};

export default DragSource('device', deviceSource, collect)(Item);
