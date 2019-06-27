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
    const { t, group, isSelected, selectGroup } = this.props;
    const { isOver, connectDropTarget, stores } = this.props;
    const { groupsStore, devicesStore } = stores;
    return connectDropTarget(
      group.name === 'all' ? (
        <div
          title={group.friendlyName}
          id={group.identifier}
          className={'groups-panel__item groups-panel__item--artificial' + (isSelected ? ' groups-panel__item--selected' : '') + (isOver ? ' groups-panel__item--active' : '')}
          onClick={() => {
            selectGroup({ type: 'artificial', groupName: group.name, id: group.id });
          }}
          key={group.name}
        >
          <div className='groups-panel__item-desc'>
            <div className='groups-panel__item-title'>{group.friendlyName}</div>
            <div className='groups-panel__item-subtitle' id={'group-' + group.name + '-devices'}>
              {t('devices.device_count', { count: devicesStore.devicesInitialTotalCount })}
            </div>
          </div>
        </div>
      ) : (
        <div
          title={group.friendlyName}
          id={group.identifier}
          className={'groups-panel__item groups-panel__item--artificial' + (isSelected ? ' groups-panel__item--selected' : '') + (isOver ? ' groups-panel__item--active' : '')}
          key={group.name}
        >
          <div className='groups-panel__item-desc'>
            <div className='groups-panel__item-title'>{group.friendlyName}</div>
            <div
              className={
                'groups-panel__item-subtitle' +
                (groupsStore.selectedGroup.ungrouped === 'inAnyGroup' ? ' groups-panel__item-subtitle--selected' : '') +
                (isOver ? ' groups-panel__item-subtitle--active' : '')
              }
              id={'group-' + group.name + '-devices'}
              onClick={() => {
                selectGroup({ type: 'artificial', groupName: group.name, id: group.id, ungrouped: 'inAnyGroup' });
              }}
            >
              <span>Not in a group: </span>
              <span>{t('devices.device_count', { count: devicesStore.devicesUngroupedCount_inAnyGroup })}</span>
            </div>
            <div
              className={
                'groups-panel__item-subtitle' +
                (groupsStore.selectedGroup.ungrouped === 'notInSmartGroup' ? ' groups-panel__item-subtitle--selected' : '') +
                (isOver ? ' groups-panel__item-subtitle--active' : '')
              }
              id={'group-' + group.name + '-devices'}
              onClick={() => {
                selectGroup({ type: 'artificial', groupName: group.name, id: group.id, ungrouped: 'notInSmartGroup' });
              }}
            >
              <span>Not in a smart group: </span>
              <span>{t('devices.device_count', { count: devicesStore.devicesUngroupedCount_notInSmartGroup })}</span>
            </div>
            <div
              className={
                'groups-panel__item-subtitle' +
                (groupsStore.selectedGroup.ungrouped === 'notInFixedGroup' ? ' groups-panel__item-subtitle--selected' : '') +
                (isOver ? ' groups-panel__item-subtitle--active' : '')
              }
              id={'group-' + group.name + '-devices'}
              onClick={() => {
                selectGroup({ type: 'artificial', groupName: group.name, id: group.id, ungrouped: 'notInFixedGroup' });
              }}
            >
              <span>{t('groups.not_in_a_fixed_group')}</span>
              <span>{t('devices.device_count', { count: devicesStore.devicesUngroupedCount_notInFixedGroup })}</span>
            </div>
          </div>
        </div>
      ),
    );
  }
}

ListItemArtificial.propTypes = {
  group: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  selectGroup: PropTypes.func.isRequired,
  onDeviceDrop: PropTypes.func.isRequired,
  isDND: PropTypes.bool.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(DropTarget(props => (props.isDND ? 'device' : ''), groupTarget, collect)(ListItemArtificial));
