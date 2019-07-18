/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { withTranslation } from 'react-i18next';
import { DropTarget } from 'react-dnd';

import { GROUP_GROUP_TYPE_STATIC } from '../../constants/groupConstants';
import RenameModal from './RenameModal';
import { Dropdown } from '../../partials';

const groupTarget = {
  drop(props, monitor) {
    const device = monitor.getItem();
    if (props.group.groupType === GROUP_GROUP_TYPE_STATIC) {
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

  showRenameModal = (e) => {
    if (e) e.stopPropagation();
    this.renameModalShown = true;
  };

  hideRenameModal = (e) => {
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
    const { t, group, isSelected, selectGroup, isOver, connectDropTarget, isSmart, stores } = this.props;
    const { groupsStore } = stores;
    return connectDropTarget(
      <div
        title={group.groupName}
        className={`groups-panel__item${isSelected ? ' groups-panel__item--selected' : ''}${isOver ? ' groups-panel__item--active' : ''}`}
        id={`button-group-${group.groupName}`}
        onClick={() => {
          selectGroup({ type: 'real', groupName: group.groupName, id: group.id, isSmart });
        }}
      >
        {!isSmart ? (
          <div className={`groups-panel__item-icon groups-panel__item-icon--default${isSelected ? '-active' : ''}`} />
        ) : (
          <div className={`groups-panel__item-icon groups-panel__item-icon--smart${isSelected ? '-active' : ''}`} />
        )}
        <div className="groups-panel__item-desc">
          <div className="groups-panel__item-title">
            <div className="groups-panel__item-title-value">{group.groupName}</div>
            <div className="dots" onClick={this.showDropdown} id={`group-${group.groupName}-dropdown`}>
              <span />
              <span />
              <span />
            </div>
            {this.showEdit && (
              <Dropdown show={this.showEdit} hideSubmenu={this.hideDropdown}>
                <a
                  className="package-dropdown-item"
                  href="#"
                  id="edit-comment"
                  onClick={(e) => {
                    e.preventDefault();
                    selectGroup({ type: 'real', groupName: group.groupName, id: group.id, isSmart });
                    this.showRenameModal();
                  }}
                >
                  <li className="package-dropdown-item">
                    {t('groups.renaming.rename_group')}
                  </li>
                </a>
              </Dropdown>
            )}
          </div>
          <div className="groups-panel__item-subtitle" id={`group-${group.groupName}-devices`}>
            {t('devices.device_count', { count: group.devices.total })}
          </div>
        </div>
        {this.renameModalShown ? (
          <RenameModal
            shown={this.renameModalShown}
            hide={this.hideRenameModal}
            groupsStore={groupsStore}
            action="rename"
            modalTitle={t('groups.edit_group')}
            buttonText={t('groups.save')}
          />
        ) : null}
      </div>,
    );
  }
}

ListItem.propTypes = {
  stores: PropTypes.shape({}),
  group: PropTypes.shape({}).isRequired,
  isSelected: PropTypes.bool.isRequired,
  selectGroup: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  isSmart: PropTypes.bool,
  t: PropTypes.func.isRequired
};

export default withTranslation()(DropTarget('device', groupTarget, collect)(ListItem));
