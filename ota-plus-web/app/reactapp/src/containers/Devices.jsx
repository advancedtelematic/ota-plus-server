import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { FlatButton } from 'material-ui';
import { Loader, ConfirmationModal, EditModal } from '../partials';
import { resetAsync } from '../utils/Common';
import { DevicesCreateModal } from '../components/devices';
import { GroupsCreateModal } from '../components/groups';
import { DevicesGroupsPanel, DevicesContentPanel } from '../components/devices';
import _ from 'underscore';

@observer
class Devices extends Component {
    @observable createModalShown = false;
    @observable createGroupModalShown = false;
    @observable deleteConfirmationShown = false;
    @observable itemToDelete = null;
    @observable itemToEdit = null;
    @observable editNameShown = false;

    constructor(props) {
        super(props);
        this.showCreateGroupModal = this.showCreateGroupModal.bind(this);
        this.hideCreateGroupModal = this.hideCreateGroupModal.bind(this);
        this.selectGroup = this.selectGroup.bind(this);
        this.onDeviceDrop = this.onDeviceDrop.bind(this);
        this.changeSort = this.changeSort.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.showDeleteConfirmation = this.showDeleteConfirmation.bind(this);
        this.hideDeleteConfirmation = this.hideDeleteConfirmation.bind(this);
        this.deleteDevice = this.deleteDevice.bind(this);
        this.showEditName = this.showEditName.bind(this);
        this.hideEditName = this.hideEditName.bind(this);
    }
    showCreateGroupModal(e) {
        if(e) e.preventDefault();
        this.createGroupModalShown = true;
    }
    hideCreateGroupModal(e) {
        if(e) e.preventDefault();
        this.createGroupModalShown = false;
        resetAsync(this.props.groupsStore.groupsCreateAsync);
    }
    showDeleteConfirmation(device, e) {
        if(e) e.preventDefault();
        this.itemToDelete = device;
        this.deleteConfirmationShown = true;
    }
    showEditName(device, e) {
        if(e) e.preventDefault();
        this.itemToEdit = device;
        this.editNameShown = true;
    }
    hideEditName() {
        this.editNameShown = false;
    }
    deleteDevice(e) {
        if(e) e.preventDefault();
        const deviceUuid = this.itemToDelete.uuid;
        const { devicesStore, groupsStore } = this.props;
        devicesStore.deleteDevice(deviceUuid).then(() => {
            const foundGroup = _.find(groupsStore.groups, (group) => {
                return group.devices.values.indexOf(deviceUuid) > -1;
            });
            if(foundGroup) {
                foundGroup.devices.total--;
            }
            devicesStore._decreaseDeviceInitialTotalCount();
            this.hideDeleteConfirmation();
        });
    }
    hideDeleteConfirmation() {
        this.deleteConfirmationShown = false;
    }
    selectGroup(group) {
        const { devicesStore, groupsStore } = this.props;
        groupsStore.selectedGroup = group;
        const groupId = group.id || null;
        devicesStore.fetchDevices(devicesStore.devicesFilter, groupId);
    }
    onDeviceDrop(device, groupId) {
        if(device.groupId !== groupId && device.groupId) {
            this.props.groupsStore.removeDeviceFromGroup(device.groupId, device.uuid);
        }
        if(device.groupId !== groupId && groupId) {
            this.props.groupsStore.addDeviceToGroup(groupId, device.uuid);
        }
    }
    changeSort(sort, e) {
        if(e) e.preventDefault();
        this.props.devicesStore._prepareDevices(sort);
    }
    changeFilter(filter, e) {
        if(e) e.preventDefault();
        let groupId = this.props.groupsStore.selectedGroup.id;
        this.props.devicesStore.fetchDevices(filter, groupId);
    }
    render() {
        const { devicesStore, groupsStore, alphaPlusEnabled } = this.props;
        return (
            <span>
                {devicesStore.devicesInitialTotalCount === null && devicesStore.devicesFetchAsync.isFetching ?
                    <div className="wrapper-center">
                        <Loader />
                    </div>
                :
                    devicesStore.devicesInitialTotalCount ?
                            <span>
                                <DevicesGroupsPanel 
                                    devicesStore={devicesStore}
                                    groupsStore={groupsStore}
                                    showCreateGroupModal={this.showCreateGroupModal}
                                    selectGroup={this.selectGroup}
                                    onDeviceDrop={this.onDeviceDrop}
                                />
                                <DevicesContentPanel 
                                    devicesStore={devicesStore}
                                    groupsStore={groupsStore}
                                    changeSort={this.changeSort}
                                    changeFilter={this.changeFilter}
                                    alphaPlusEnabled={alphaPlusEnabled}
                                    showDeleteConfirmation={this.showDeleteConfirmation}
                                    showEditName={this.showEditName}
                                />
                            </span>
                        
                    :
                        <div className="wrapper-center">
                            <div className="page-intro">
                                <div>
                                    <img src="/assets/img/icons/white/devices.svg" alt="Icon" />
                                </div>
                                <div>
                                    You haven't created any devices yet.
                                </div>
                                <a href="https://docs.atsgarage.com/quickstarts/start-intro.html" className="add-button light" id="add-new-device" target="_blank">
                                    <span>
                                        +
                                    </span>
                                    <span>
                                        Add new device
                                    </span>
                                </a>
                            </div>
                        </div>
                }
                <GroupsCreateModal 
                    shown={this.createGroupModalShown}
                    hide={this.hideCreateGroupModal}
                    selectGroup={this.selectGroup}
                    groupsStore={groupsStore}
                    devicesStore={devicesStore}
                />
                {this.deleteConfirmationShown ?
                    <ConfirmationModal
                        modalTitle={
                            <div className="text-red">
                                Delete device
                            </div>
                        }
                        shown={this.deleteConfirmationShown}
                        hide={this.hideDeleteConfirmation}
                        deleteItem={this.deleteDevice}
                        topText={
                            <div className="delete-modal-top-text">
                                Device will be removed now and can be re-provisioned.
                            </div>
                        }
                    />
                :
                    null
                }
                {this.editNameShown ?
                    <EditModal
                        modalTitle={
                            <div>
                                Edit name
                            </div>
                    }
                        shown={this.editNameShown}
                        hide={this.hideEditName}
                        devicesStore={devicesStore}
                        device={this.itemToEdit}
                    />
                :
                    null
                }
            </span>
        );
    }
}

Devices.propTypes = {
    devicesStore: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired
}

export default Devices;