/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { Loader, ConfirmationModal, EditModal } from '../partials';
import { resetAsync } from '../utils/Common';
import { GroupsCreateModal } from '../components/groups';
import { DevicesGroupsPanel, DevicesContentPanel } from '../components/devices';

@inject('stores')
@observer
class Devices extends Component {
  static propTypes = {
    stores: PropTypes.object,
    addNewWizard: PropTypes.func,
  };

  @observable
  createModalShown = false;
  @observable
  createGroupModalShown = false;
  @observable
  deleteConfirmationShown = false;
  @observable
  itemToDelete = null;
  @observable
  itemToEdit = null;
  @observable
  editNameShown = false;

  constructor(props) {
    super(props);
    const { groupsStore, devicesStore } = props.stores;
    this.fetchUngroupedDevicesHandler = observe(groupsStore, change => {
      if (change.name === 'groupsFetchDevicesAsync' && change.object[change.name].isFetching === false) {
        devicesStore.fetchUngroupedDevices();
      }
    });
  }

  componentWillUnmount() {
    this.fetchUngroupedDevicesHandler();
  }

  showCreateGroupModal = e => {
    if (e) e.preventDefault();
    this.createGroupModalShown = true;
  };

  hideCreateGroupModal = e => {
    if (e) e.preventDefault();
    const { groupsStore } = this.props.stores;
    this.createGroupModalShown = false;
    resetAsync(groupsStore.groupsCreateAsync);
  };

  showDeleteConfirmation = (device, e) => {
    if (e) e.preventDefault();
    this.itemToDelete = device;
    this.deleteConfirmationShown = true;
  };

  showEditName = (device, e) => {
    if (e) e.preventDefault();
    this.itemToEdit = device;
    this.editNameShown = true;
  };

  hideEditName = () => {
    this.editNameShown = false;
  };

  deleteDevice = e => {
    if (e) e.preventDefault();
    const deviceUuid = this.itemToDelete.uuid;
    const { devicesStore, groupsStore } = this.props.stores;
    devicesStore.deleteDevice(deviceUuid).then(() => {
      const foundGroup = _.find(groupsStore.groups, group => group.devices.values.indexOf(deviceUuid) > -1);
      if (foundGroup) {
        foundGroup.devices.total--;
      }
      devicesStore.devicesInitialTotalCount--;
      this.hideDeleteConfirmation();
    });
  };

  hideDeleteConfirmation = () => {
    this.deleteConfirmationShown = false;
  };

  selectGroup = group => {
    const { devicesStore, groupsStore } = this.props.stores;
    groupsStore.selectedGroup = group;
    const groupId = group.id || null;
    devicesStore.fetchDevices(devicesStore.devicesFilter, groupId);
    if (group.isSmart) {
      groupsStore.fetchExpressionForSelectedGroup(groupsStore.selectedGroup.id);
    }
  };

  onDeviceDrop = (device, groupId) => {
    const { groupsStore, devicesStore } = this.props.stores;
    devicesStore.fetchUngroupedDevices();
    if (device.groupId !== groupId && device.groupId) {
      groupsStore.removeDeviceFromGroup(device.groupId, device.uuid);
    }
    if (device.groupId !== groupId && groupId) {
      groupsStore.addDeviceToGroup(groupId, device.uuid);
    }
  };

  changeSort = (sort, e) => {
    if (e) e.preventDefault();
    const { devicesStore } = this.props.stores;
    devicesStore._prepareDevices(sort);
  };

  changeFilter = (filter, e) => {
    if (e) e.preventDefault();
    const { devicesStore, groupsStore } = this.props.stores;
    const groupId = groupsStore.selectedGroup.id;
    devicesStore.fetchDevices(filter, groupId);
  };

  render() {
    const { addNewWizard } = this.props;
    const { devicesStore } = this.props.stores;
    return (
      <span>
        {devicesStore.devicesInitialTotalCount === null && devicesStore.devicesFetchAsync.isFetching ? (
          <div className='wrapper-center'>
            <Loader />
          </div>
        ) : devicesStore.devicesInitialTotalCount ? (
          <span>
            <DevicesGroupsPanel showCreateGroupModal={this.showCreateGroupModal} selectGroup={this.selectGroup} onDeviceDrop={this.onDeviceDrop} />
            <DevicesContentPanel
              changeSort={this.changeSort}
              changeFilter={this.changeFilter}
              showDeleteConfirmation={this.showDeleteConfirmation}
              showEditName={this.showEditName}
              addNewWizard={addNewWizard}
            />
          </span>
        ) : (
          <div className='wrapper-center'>
            <div className='page-intro'>
              <div>
                <img src='/assets/img/icons/white/devices.svg' alt='Icon' />
              </div>
              <div>{"You haven't created any devices yet."}</div>
              <a href='https://docs.ota.here.com/quickstarts/start-intro.html' className='add-button light' id='add-new-device' target='_blank'>
                <span>+</span>
                <span>Add new device</span>
              </a>
            </div>
          </div>
        )}
        {this.createGroupModalShown ? <GroupsCreateModal shown={this.createGroupModalShown} hide={this.hideCreateGroupModal} selectGroup={this.selectGroup} /> : null}
        {this.deleteConfirmationShown ? (
          <ConfirmationModal
            modalTitle={<div className='text-red'>Delete device</div>}
            id='delete-device-confirmation-modal'
            shown={this.deleteConfirmationShown}
            hide={this.hideDeleteConfirmation}
            deleteItem={this.deleteDevice}
            topText={<div className='delete-modal-top-text'>Device will be removed.</div>}
          />
        ) : null}
        {this.editNameShown ? <EditModal modalTitle={<div>Edit name</div>} shown={this.editNameShown} hide={this.hideEditName} device={this.itemToEdit} /> : null}
      </span>
    );
  }
}

export default Devices;
