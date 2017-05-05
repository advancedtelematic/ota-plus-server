import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { FlatButton } from 'material-ui';
import { Loader } from '../partials';
import { resetAsync } from '../utils/Common';
import { DevicesTooltip, DevicesCreateModal, DevicesRenameModal } from '../components/devices';
import { GroupsCreateModal, GroupsRenameModal } from '../components/groups';
import { DevicesGroupsPanel, DevicesContentPanel } from '../components/devices';

@observer
class Devices extends Component {
    @observable tooltipShown = false;
    @observable createModalShown = false;
    @observable renameModalShown = false;
    @observable createGroupModalShown = false;
    @observable renameGroupModalShown = false;
    @observable actionDeviceId = null;
    @observable actionGroupId = null;

    constructor(props) {
        super(props);
        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
        this.showCreateModal = this.showCreateModal.bind(this);
        this.hideCreateModal = this.hideCreateModal.bind(this);
        this.showRenameModal = this.showRenameModal.bind(this);
        this.hideRenameModal = this.hideRenameModal.bind(this);
        this.showCreateGroupModal = this.showCreateGroupModal.bind(this);
        this.hideCreateGroupModal = this.hideCreateGroupModal.bind(this);
        this.showRenameGroupModal = this.showRenameGroupModal.bind(this);
        this.hideRenameGroupModal = this.hideRenameGroupModal.bind(this);
        this.selectGroup = this.selectGroup.bind(this);
        this.onDeviceDrop = this.onDeviceDrop.bind(this);
        this.changeSort = this.changeSort.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
    }
    showTooltip(e) {
        if(e) e.preventDefault();
        this.tooltipShown = true;
    }
    hideTooltip(e) {
        if(e) e.preventDefault();
        this.tooltipShown = false;
    }
    showCreateModal(e) {
        if(e) e.preventDefault();
        this.createModalShown = true;
    }
    hideCreateModal(e) {
        if(e) e.preventDefault();
        this.createModalShown = false;
        resetAsync(this.props.devicesStore.devicesCreateAsync);
    }
    showRenameModal(deviceId, e) {
        if(e) e.preventDefault();
        this.renameModalShown = true;
        this.actionDeviceId = deviceId;
    }
    hideRenameModal(e) {
        if(e) e.preventDefault();
        this.renameModalShown = false;
        this.actionDeviceId = null;
        resetAsync(this.props.devicesStore.devicesRenameAsync);
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
    showRenameGroupModal(groupId, e) {
        if(e) e.preventDefault();
        this.renameGroupModalShown = true;
        this.actionGroupId = groupId;
    }
    hideRenameGroupModal(e) {
        if(e) e.preventDefault();
        this.renameGroupModalShown = false;
        this.actionGroupId = null;
        resetAsync(this.props.groupsStore.groupsRenameAsync);
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
    changeFilter(filter) {
        this.props.devicesStore.fetchDevices(filter);
    }
    render() {
        const { devicesStore, groupsStore } = this.props;
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
                                    showRenameGroupModal={this.showRenameGroupModal}
                                    selectGroup={this.selectGroup}
                                    onDeviceDrop={this.onDeviceDrop}
                                />
                                <DevicesContentPanel 
                                    devicesStore={devicesStore}
                                    groupsStore={groupsStore}
                                    showRenameModal={this.showRenameModal}
                                    showCreateModal={this.showCreateModal}
                                    changeSort={this.changeSort}
                                    changeFilter={this.changeFilter}
                                />
                            </span>
                        
                    :
                        <div className="wrapper-center">
                            <div className="page-intro">
                                <div>You haven't created any devices yet.</div>
                                <div>
                                    <FlatButton
                                        label="Add new device"
                                        type="button"
                                        className="btn-main"
                                        onClick={this.showCreateModal}
                                    />
                                </div>
                                <a href="#" onClick={this.showTooltip}>What is this?</a>
                            </div>
                        </div>
                }
                <DevicesTooltip 
                    shown={this.tooltipShown}
                    hide={this.hideTooltip}
                />
                <DevicesCreateModal 
                    shown={this.createModalShown}
                    hide={this.hideCreateModal}
                    devicesStore={devicesStore}
                />
                <DevicesRenameModal 
                    shown={this.renameModalShown}
                    hide={this.hideRenameModal}
                    deviceId={this.actionDeviceId}
                    devicesStore={devicesStore}
                />
                <GroupsCreateModal 
                    shown={this.createGroupModalShown}
                    hide={this.hideCreateGroupModal}
                    selectGroup={this.selectGroup}
                    groupsStore={groupsStore}
                />
                <GroupsRenameModal 
                    shown={this.renameGroupModalShown}
                    hide={this.hideRenameGroupModal}
                    groupId={this.actionGroupId}
                    groupsStore={groupsStore}
                />
            </span>
        );
    }
}

Devices.propTypes = {
    devicesStore: PropTypes.object,
    groupsStore: PropTypes.object
}

export default Devices;