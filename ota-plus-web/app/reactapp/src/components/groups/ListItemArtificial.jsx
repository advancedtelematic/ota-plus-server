/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { DropTarget } from 'react-dnd';

const groupTarget = {
  drop(props, monitor) {
    const device = monitor.getItem();
    if (props.group.name === 'ungrouped') {
      props.onDeviceDrop(device, null);
    }
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
}

@inject('stores')
@observer
class ListItemArtificial extends Component {
  render() {
    const { t, group, isSelected, selectGroup, isOver, connectDropTarget, stores } = this.props;
    const { groupsStore, devicesStore } = stores;
    const { ungrouped } = groupsStore.selectedGroup;
    return connectDropTarget(
      group.name === 'all' ? (
        <div
          title={group.friendlyName}
          id={group.identifier}
          className={`groups-panel__item groups-panel__item--artificial${isSelected ? ' groups-panel__item--selected' : ''}${isOver ? ' groups-panel__item--active' : ''}`}
          onClick={() => {
            selectGroup({ type: 'artificial', groupName: group.name, id: group.id });
          }}
          key={group.name}
        >
          <div className="groups-panel__item-desc">
            <div className="groups-panel__item-title">{group.friendlyName}</div>
            <div className="groups-panel__item-subtitle" id={`group-${group.name}-devices`}>
              {t('devices.device_count', { count: devicesStore.devicesInitialTotalCount })}
            </div>
          </div>
        </div>
      ) : (
        <div
          title={group.friendlyName}
          id={group.identifier}
          className={`groups-panel__item groups-panel__item--artificial${isSelected ? ' groups-panel__item--selected' : ''}${isOver ? ' groups-panel__item--active' : ''}`}
          key={group.name}
        >
          <div className="groups-panel__item-desc">
            <div className="groups-panel__item-title">{group.friendlyName}</div>
            <div
              className={
                `groups-panel__item-subtitle${
                  ungrouped === 'inAnyGroup' ? ' groups-panel__item-subtitle--selected' : ''
                }${isOver ? ' groups-panel__item-subtitle--active' : ''}`
              }
              id={`group-${group.name}-devices`}
              onClick={() => {
                selectGroup({ type: 'artificial', groupName: group.name, id: group.id, ungrouped: 'inAnyGroup' });
              }}
            >
              <span>Not in a group: </span>
              <span>{t('devices.device_count', { count: devicesStore.devicesUngroupedCountInAnyGroup })}</span>
            </div>
            <div
              className={
                `groups-panel__item-subtitle${
                  ungrouped === 'notInSmartGroup' ? ' groups-panel__item-subtitle--selected' : ''
                }${isOver ? ' groups-panel__item-subtitle--active' : ''}`
              }
              id={`group-${group.name}-devices`}
              onClick={() => {
                selectGroup({ type: 'artificial', groupName: group.name, id: group.id, ungrouped: 'notInSmartGroup' });
              }}
            >
              <span>Not in a smart device group: </span>
              <span>{t('devices.device_count', { count: devicesStore.devicesUngroupedCountNotInSmartGroup })}</span>
            </div>
            <div
              className={
                `groups-panel__item-subtitle${
                  ungrouped === 'notInFixedGroup' ? ' groups-panel__item-subtitle--selected' : ''
                }${isOver ? ' groups-panel__item-subtitle--active' : ''}`
              }
              id={`group-${group.name}-devices`}
              onClick={() => {
                selectGroup({ type: 'artificial', groupName: group.name, id: group.id, ungrouped: 'notInFixedGroup' });
              }}
            >
              <span>{t('groups.not_in_a_fixed_group')}</span>
              <span>{t('devices.device_count', { count: devicesStore.devicesUngroupedCountNotInFixedGroup })}</span>
            </div>
          </div>
        </div>
      ),
    );
  }
}

ListItemArtificial.propTypes = {
  stores: PropTypes.shape({}),
  group: PropTypes.shape({}).isRequired,
  isSelected: PropTypes.bool.isRequired,
  selectGroup: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(
  DropTarget(props => (props.isDND ? 'device' : ''), groupTarget, collect)(ListItemArtificial)
);
