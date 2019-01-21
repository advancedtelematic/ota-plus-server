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
    const foundClassicGroup = _.find(groupsStore.groups, group => {
      return group.devices.values.indexOf(props.device.uuid) > -1 && group.groupType === 'static';
    });

    return {
      uuid: props.device.uuid,
      groupId: foundClassicGroup ? foundClassicGroup.id : null,
    };
  },
  endDrag(props, monitor) {
    const { devicesStore, groupsStore } = props.stores;
    let selectedGroup = groupsStore.selectedGroup;
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

  showMenu = e => {
    e.stopPropagation();
    this.menuShown = true;
  };

  hideMenu = e => {
    this.menuShown = false;
  };

  render() {
    const { device, goToDetails, showDeleteConfirmation, showEditName } = this.props;
    const { groupsStore } = this.props.stores;
    const { isDragging, connectDragSource } = this.props;
    const opacity = isDragging ? 0.4 : 1;
    const lastSeenDate = new Date(device.lastSeen);
    let deviceStatus = 'Status unknown';
    switch (device.deviceStatus) {
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
    if (!groupsStore.groupsFetchAsync.isFetching) {
      foundGroup = _.find(groupsStore.groups, group => {
        return group.devices.values.indexOf(device.uuid) > -1;
      });
    }
    return connectDragSource(
      <div className='devices-panel__device'>
        <div className='hover-area' style={{ opacity }} onClick={goToDetails.bind(this, device.uuid)} id={'link-devicedetails-' + device.uuid} />
        <div className='dots align' id={'device-actions-' + device.uuid} onClick={this.showMenu}>
          <div className='dots__wrapper'>
            <span />
            <span />
            <span />
          </div>
        </div>
        {this.menuShown ? (
          <Dropdown hideSubmenu={this.hideMenu} customClassName={'align'}>
            <li className='device-dropdown-item'>
              <a className='device-dropdown-item' id='edit-device' onClick={showEditName.bind(this, device)}>
                <img src='/assets/img/icons/edit_icon.svg' alt='Icon' />
                Edit device
              </a>
            </li>
            <li className='device-dropdown-item'>
              <a className='device-dropdown-item' id='delete-device' onClick={showDeleteConfirmation.bind(this, device)}>
                <img src='/assets/img/icons/trash_icon.svg' alt='Icon' />
                Delete device
              </a>
            </li>
          </Dropdown>
        ) : null}
        <div className='devices-panel__device-icon'>
          <div className={'device-status device-status--' + device.deviceStatus} title={deviceStatus} />
        </div>

        <div className='devices-panel__device-desc'>
          <div className='devices-panel__device-title' title={device.deviceName} id={device.deviceName}>
            {device.deviceName}
          </div>
          <div className='devices-panel__device-subtitle' title={device.deviceId} id={device.deviceId}>
            ID: {device.deviceId}
          </div>
          <div className='devices-panel__device-subtitle'>
            {deviceStatus !== 'Status unknown' ? <span>Last seen: {lastSeenDate.toDateString() + ' ' + lastSeenDate.toLocaleTimeString()}</span> : <span>Never seen online</span>}
          </div>
          <div className='devices-panel__device-subtitle'>{foundGroup ? 'Group: ' + foundGroup.groupName : 'Ungrouped'}</div>
        </div>
      </div>,
    );
  }
}

Item.propTypes = {
  stores: PropTypes.object,
  device: PropTypes.object.isRequired,
  goToDetails: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
};

export default DragSource('device', deviceSource, collect)(Item);
