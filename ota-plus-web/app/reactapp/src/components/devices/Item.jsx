/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import { Dropdown } from '../../partials';
import { DEVICE_STATUS_ERROR, DEVICE_STATUS_OUTDATED, DEVICE_STATUS_UP_TO_DATE } from '../../constants/deviceConstants';
import { GROUP_GROUP_TYPE_REAL, GROUP_GROUP_TYPE_STATIC } from '../../constants/groupConstants';
import { DEVICE_LAST_UPDATED_DATE_FORMAT } from '../../constants/datesTimesConstants';
import { getFormattedDateTime } from '../../helpers/datesTimesHelper';

const deviceSource = {
  beginDrag(props) {
    const { groupsStore } = props.stores;
    const { selectedGroup } = groupsStore;
    const { uuid } = props.device;
    const foundClassicGroup = _.find(
      groupsStore.groups,
      group => group.devices.values.indexOf(uuid) > -1 && group.groupType === GROUP_GROUP_TYPE_STATIC
    );
    let groupId;
    if (foundClassicGroup) {
      groupId = foundClassicGroup.id;
    } else if (!selectedGroup.isSmart && selectedGroup.type === GROUP_GROUP_TYPE_REAL) {
      groupId = selectedGroup.id;
    }
    return {
      uuid,
      groupId,
    };
  }
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

  hideMenu = () => {
    this.menuShown = false;
  };

  render() {
    const semiTransparent = 0.4;
    const { device, goToDetails, showDeleteConfirmation, showEditName, t } = this.props;
    const { uuid, deviceId, deviceName, deviceStatus, lastSeen } = device;
    const { isDragging, connectDragSource } = this.props;
    const opacity = isDragging ? semiTransparent : 1;
    let deviceStatusMessage = t('devices.statuses.unknown');
    switch (deviceStatus) {
      case DEVICE_STATUS_UP_TO_DATE:
        deviceStatusMessage = t('devices.statuses.synchronized');
        break;
      case DEVICE_STATUS_OUTDATED:
        deviceStatusMessage = t('devices.statuses.unsynchronized');
        break;
      case DEVICE_STATUS_ERROR:
        deviceStatusMessage = t('devices.statuses.error');
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
                {t('devices.rename')}
              </a>
            </li>
            <li className="device-dropdown-item">
              <a
                className="device-dropdown-item"
                id="delete-device"
                onClick={showDeleteConfirmation.bind(this, device)}
              >
                {t('devices.delete')}
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
            {t('devices.id_item', { id: deviceId })}
          </div>
          <div className="devices-panel__device-subtitle">
            {deviceStatusMessage !== t('devices.statuses.unknown')
              ? (
                <span>
                  {
                    t('devices.last_updated_item',
                      { date: getFormattedDateTime(lastSeen, DEVICE_LAST_UPDATED_DATE_FORMAT) })
                  }
                </span>
              )
              : <span>{t('devices.never_seen_online')}</span>
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
  showEditName: PropTypes.func,
  t: PropTypes.func.isRequired
};

export default DragSource('device', deviceSource, collect)(withTranslation()(Item));
