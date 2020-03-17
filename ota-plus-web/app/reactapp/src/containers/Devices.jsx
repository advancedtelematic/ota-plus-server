/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observable, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import { Loader, ConfirmationModal, EditModal } from '../partials';
import { resetAsync } from '../utils/Common';
import { GroupsCreateModal } from '../components/groups';
import { DevicesGroupsPanel, DevicesContentPanel } from '../components/devices';
import { ANALYTICS_VIEW_DEVICES } from '../constants/analyticsViews';
import { sendAction, setAnalyticsView } from '../helpers/analyticsHelper';
import {
  OTA_DEVICES_SEE_ALL,
  OTA_DEVICES_SEE_GROUPED,
  OTA_DEVICES_SEE_UNGROUPED,
  OTA_DEVICES_SEARCH_DEVICE
} from '../constants/analyticsActions';
import { DEVICE_ICON_OLD_WHITE, DEVICES_LIMIT_PER_PAGE, GROUPS_FETCH_DEVICES_ASYNC } from '../config';
import { URL_GET_STARTED } from '../constants/urlConstants';

@inject('stores')
@observer
class Devices extends Component {
  static propTypes = {
    addNewWizard: PropTypes.func,
    history: PropTypes.shape({}),
    stores: PropTypes.shape({}),
    t: PropTypes.func.isRequired,
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
    this.fetchUngroupedDevicesHandler = observe(groupsStore, (change) => {
      if (change.name === GROUPS_FETCH_DEVICES_ASYNC && change.object[change.name].isFetching === false) {
        devicesStore.fetchUngroupedDevicesCount();
      }
    });
  }

  componentDidMount() {
    setAnalyticsView(ANALYTICS_VIEW_DEVICES);
    sendAction(OTA_DEVICES_SEE_ALL);
    const { history } = this.props;
    const { state } = history.location;
    if (state && state.openWizard) {
      this.showCreateGroupModal();
    }
  }

  componentWillUnmount() {
    this.fetchUngroupedDevicesHandler();
  }

  showCreateGroupModal = (e) => {
    if (e) e.preventDefault();
    this.createGroupModalShown = true;
  };

  hideCreateGroupModal = (e) => {
    if (e) e.preventDefault();
    const { stores } = this.props;
    const { groupsStore } = stores;
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

  deleteDevice = (e) => {
    if (e) e.preventDefault();
    const { stores } = this.props;
    const deviceUuid = this.itemToDelete.uuid;
    const { devicesStore, groupsStore } = stores;
    devicesStore.deleteDevice(deviceUuid).then(() => {
      const foundGroup = _.find(groupsStore.groups, group => group.devices.values.indexOf(deviceUuid) > -1);
      if (foundGroup) {
        foundGroup.devices.total -= 1;
      }
      devicesStore.devicesInitialTotalCount -= 1;
      this.hideDeleteConfirmation();
    });
  };

  hideDeleteConfirmation = () => {
    this.deleteConfirmationShown = false;
  };

  selectGroup = (group) => {
    const { stores } = this.props;
    const { devicesStore, groupsStore } = stores;
    groupsStore.selectedGroup = group;
    const groupId = group.id || null;
    const ungrouped = group.ungrouped || null;
    devicesStore.resetPageNumber();
    devicesStore.fetchDevices(devicesStore.devicesFilter, groupId, ungrouped, DEVICES_LIMIT_PER_PAGE, 0);
    if (group.isSmart) {
      groupsStore.fetchExpressionForSelectedGroup(groupsStore.selectedGroup.id);
    }

    if (groupsStore.selectedGroup.ungrouped) {
      sendAction(OTA_DEVICES_SEE_UNGROUPED);
    } else if (!groupsStore.selectedGroup.ungrouped && groupsStore.selectedGroup.id) {
      sendAction(OTA_DEVICES_SEE_GROUPED);
    } else {
      sendAction(OTA_DEVICES_SEE_ALL);
    }
  };

  onDeviceDrop = async (device, groupId) => {
    const { stores } = this.props;
    const { groupsStore, devicesStore } = stores;
    devicesStore.fetchUngroupedDevicesCount();
    if (device.groupId !== groupId && device.groupId) {
      await groupsStore.removeDeviceFromGroup(device.groupId, device.uuid);
    }
    if (device.groupId !== groupId && groupId) {
      await groupsStore.addDeviceToGroup(groupId, device.uuid);
    }
    const { selectedGroup } = groupsStore;
    const selectedGroupId = selectedGroup.id || null;
    const ungrouped = groupsStore.selectedGroup.ungrouped || null;
    devicesStore.resetPageNumber();
    devicesStore.fetchDevices(devicesStore.devicesFilter, selectedGroupId, ungrouped, DEVICES_LIMIT_PER_PAGE, 0);
  };

  changeSort = (sort, e) => {
    if (e) e.preventDefault();
    const { stores } = this.props;
    const { devicesStore } = stores;
    devicesStore.prepareDevices(sort);
  };

  changeFilter = (filter, e) => {
    if (e) e.preventDefault();
    const { stores } = this.props;
    const { devicesStore, groupsStore } = stores;
    const groupId = groupsStore.selectedGroup.id;
    const ungrouped = groupsStore.selectedGroup.ungrouped || null;
    devicesStore.resetPageNumber();
    devicesStore.fetchDevices(filter, groupId, ungrouped, DEVICES_LIMIT_PER_PAGE, 0);
    sendAction(OTA_DEVICES_SEARCH_DEVICE);
  };

  getEmptyDevicesMessage = (t, devicesFetchingError) => devicesFetchingError
    ? (
      <div>
        <div>{t('devices.empty.technical_issues')}</div>
      </div>
    ) : (
      <div>
        <div>{t('devices.empty.no_devices')}</div>
        <a
          href={URL_GET_STARTED}
          className="add-button light"
          id="add-new-device"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span>{t('devices.empty.add_new')}</span>
        </a>
      </div>
    );

  render() {
    const { addNewWizard, stores, t } = this.props;
    const { devicesStore, groupsStore } = stores;
    const { devicesInitialTotalCount } = devicesStore;
    const isFetching = devicesStore.devicesFetchAsync.isFetching
      || groupsStore.groupsAddDeviceAsync.isFetching
      || groupsStore.groupsRemoveDeviceAsync.isFetching;
    return (
      <span>
        {!devicesInitialTotalCount && isFetching ? (
          <div className="wrapper-center">
            <Loader />
          </div>
        ) : devicesInitialTotalCount ? (
          <span>
            <DevicesGroupsPanel
              showCreateGroupModal={this.showCreateGroupModal}
              selectGroup={this.selectGroup}
              onDeviceDrop={this.onDeviceDrop}
            />
            <DevicesContentPanel
              changeSort={this.changeSort}
              changeFilter={this.changeFilter}
              showDeleteConfirmation={this.showDeleteConfirmation}
              showEditName={this.showEditName}
              addNewWizard={addNewWizard}
            />
          </span>
        ) : (
          <div className="wrapper-center">
            <div className="page-intro">
              <div>
                <img src={DEVICE_ICON_OLD_WHITE} alt="Icon" />
              </div>
              {this.getEmptyDevicesMessage(t, devicesStore.devicesFetchingError)}
            </div>
          </div>
        )}
        {this.createGroupModalShown && (
          <GroupsCreateModal
            shown={this.createGroupModalShown}
            hide={this.hideCreateGroupModal}
            selectGroup={this.selectGroup}
          />
        )}
        {this.deleteConfirmationShown && (
          <ConfirmationModal
            modalTitle={<div className="text-red">Delete device</div>}
            id="delete-device-confirmation-modal"
            shown={this.deleteConfirmationShown}
            hide={this.hideDeleteConfirmation}
            deleteItem={this.deleteDevice}
            topText={<div className="delete-modal-top-text">Device will be removed.</div>}
          />
        )}
        {this.editNameShown && (
          <EditModal
            modalTitle={<div>Rename device</div>}
            shown={this.editNameShown}
            hide={this.hideEditName}
            device={this.itemToEdit}
          />
        )}
      </span>
    );
  }
}

export default withTranslation()(withRouter(Devices));
