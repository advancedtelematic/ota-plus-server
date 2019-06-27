/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';
import { DropTarget } from 'react-dnd';
import RenameModal from './RenameModal';
import { Dropdown } from '../../partials';

const groupTarget = {
  drop(props, monitor) {
    const device = monitor.getItem();
    if (props.group.groupType === 'static') {
      props.onDeviceDrop(device, props.group.id);
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
class ListItem extends Component {
  @observable renameModalShown = false;
  @observable showEdit = false;

  showRenameModal = e => {
    if (e) e.stopPropagation();
    this.renameModalShown = true;
  };

  hideRenameModal = e => {
    if (e) e.preventDefault();
    this.renameModalShown = false;
  };

  showDropdown = () => {
    this.showEdit = true;
  };

  hideDropdown = () => {
    this.showEdit = false;
  };

  render() {
    const { t, group, isSelected, selectGroup, isOver, connectDropTarget, isSmart } = this.props;
    const { groupsStore } = this.props.stores;
    return connectDropTarget(
      <div
        title={group.groupName}
        className={'groups-panel__item' + (isSelected ? ' groups-panel__item--selected' : '') + (isOver ? ' groups-panel__item--active' : '')}
        id={'button-group-' + group.groupName}
        onClick={() => {
          selectGroup({ type: 'real', groupName: group.groupName, id: group.id, isSmart: isSmart });
        }}
      >
        {!isSmart ? (
          <div className={'groups-panel__item-icon groups-panel__item-icon--default' + (isSelected ? '-active' : '')} />
        ) : (
          <div className={'groups-panel__item-icon groups-panel__item-icon--smart' + (isSelected ? '-active' : '')} />
        )}
        <div className='groups-panel__item-desc'>
          <div className='groups-panel__item-title'>
            <div className='groups-panel__item-title-value'>{group.groupName}</div>
            <div className='dots' onClick={this.showDropdown} id={'group-' + group.groupName + '-dropdown'}>
              <span />
              <span />
              <span />
            </div>
            {this.showEdit && (
              <Dropdown show={this.showEdit} hideSubmenu={this.hideDropdown}>                
                <a
                  className='package-dropdown-item'
                  href='#'
                  id='edit-comment'
                  onClick={e => {
                    e.preventDefault();
                    selectGroup({ type: 'real', groupName: group.groupName, id: group.id, isSmart: isSmart });
                    this.showRenameModal();
                  }}
                >
                  <li className='package-dropdown-item'>
                    {'Rename group'}
                  </li>
                </a>
              </Dropdown>
            )}
          </div>
          <div className='groups-panel__item-subtitle' id={'group-' + group.groupName + '-devices'}>
            {t('common.deviceWithCount', { count: group.devices.total })}
          </div>
        </div>
        {this.renameModalShown ? <RenameModal shown={this.renameModalShown} hide={this.hideRenameModal} groupsStore={groupsStore} action='rename' modalTitle='Edit Group' buttonText='Save' /> : null}
      </div>,
    );
  }
}

ListItem.propTypes = {
  group: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  selectGroup: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired,
  onDeviceDrop: PropTypes.func.isRequired,
};

export default translate()(DropTarget('device', groupTarget, collect)(ListItem));
