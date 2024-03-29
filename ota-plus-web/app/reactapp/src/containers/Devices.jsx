/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observable, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import { Loader, ConfirmationModal, EditModal, SecondaryButton } from '../partials';
import { resetAsync } from '../utils/Common';
import { GroupsCreateModal } from '../components/groups';
import { DevicesGroupsPanel, DevicesContentPanel } from '../components/devices';
import { ANALYTICS_VIEW_DEVICES } from '../constants/analyticsViews';
import { sendAction, setAnalyticsView } from '../helpers/analyticsHelper';
import {
  OTA_DEVICES_SEE_ALL,
  OTA_DEVICES_SEE_GROUPED,
  OTA_DEVICES_SEE_UNGROUPED,
  OTA_DEVICES_SEARCH_DEVICE,
  OTA_DEVICE_DELETE
} from '../constants/analyticsActions';
import {
  DEVICE_ICON,
  DEVICES_LIMIT_PER_PAGE,
  GROUPS_FETCH_DEVICES_ASYNC,
  PLUS_ICON,
  isFeatureEnabled,
  UI_FEATURES
} from '../config';
import UnderlinedLink from '../partials/UnderlinedLink';
import { URL_PROVISIONING_CREDS } from '../constants/urlConstants';
import ReadMore from '../partials/ReadMore';
import { PATH_CREDENTIALS } from '../constants/locationConstants';
import CustomFieldsUploadModal from '../components/devices/CustomFieldsUploadModal';

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
  uploadDeviceCustomFieldsModalShown = false;

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

  showUploadDeviceCustomFieldsModal = (e) => {
    if (e) e.preventDefault();
    this.uploadDeviceCustomFieldsModalShown = true;
  };

  hideUploadDeviceCustomFieldsModal = (e) => {
    if (e) e.preventDefault();
    this.uploadDeviceCustomFieldsModalShown = false;
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
      } else {
        devicesStore.devicesUngroupedCountInAnyGroup -= 1;
      }
      devicesStore.devicesInitialTotalCount -= 1;
      devicesStore.devicesTotalCount -= 1;
      this.hideDeleteConfirmation();
      if (devicesStore.devices.length === 0 && devicesStore.devicesPageNumber > 1) {
        const { devicesFilter, devicesGroupFilter } = devicesStore;
        devicesStore.devicesPageNumber -= 1;
        const limit = DEVICES_LIMIT_PER_PAGE;
        const offset = (devicesStore.devicesPageNumber - 1) * DEVICES_LIMIT_PER_PAGE;
        devicesStore.loadMoreDevices(devicesFilter, devicesGroupFilter, limit, offset);
      }
    });
    sendAction(OTA_DEVICE_DELETE);
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

  handleProvisioningPopup = () => {
    const { history, stores } = this.props;
    const { provisioningStore } = stores;
    provisioningStore.openCreationPopup = true;
    history.push(PATH_CREDENTIALS);
  };

  getEmptyDevicesMessage = (t, devicesFetchingError) => {
    const { stores } = this.props;
    const { userStore } = stores;
    const { uiFeatures } = userStore;

    return devicesFetchingError
      ? (
        <div>
          <div>{t('devices.empty.technical-issues')}</div>
        </div>
      ) : (
        <div>
          <div>{t('devices.empty.no-devices-1')}</div>
          <ReadMore>
            <span>{t('devices.empty.no-devices-2')}</span>
            <UnderlinedLink url={URL_PROVISIONING_CREDS}>{t('miscellaneous.read-more')}</UnderlinedLink>
          </ReadMore>
          {uiFeatures.length > 0 && isFeatureEnabled(uiFeatures, UI_FEATURES.ACCESS_CREDS) && (
            <SecondaryButton type="link" onClick={this.handleProvisioningPopup}>
              <img src={PLUS_ICON} />
              {t('devices.empty.button-title')}
            </SecondaryButton>
          )}
        </div>
      );
  }

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
              uploadDeviceCustomFields={this.showUploadDeviceCustomFieldsModal}
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
              <img src={DEVICE_ICON} alt="Icon" />
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
        {this.uploadDeviceCustomFieldsModalShown && (
          <CustomFieldsUploadModal hide={this.hideUploadDeviceCustomFieldsModal} />
        )}
      </span>
    );
  }
}

export default withTranslation()(withRouter(Devices));
