import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { FlatButton } from 'material-ui';
import { Loader } from '../partials';
import { resetAsync } from '../utils/Common';
import { DevicesCreateModal } from '../components/devices';
import { GroupsCreateModal } from '../components/groups';
import { DevicesGroupsPanel, DevicesContentPanel } from '../components/devices';

@observer
class Devices extends Component {
    @observable createModalShown = false;
    @observable createGroupModalShown = false;

    constructor(props) {
        super(props);
        this.showCreateGroupModal = this.showCreateGroupModal.bind(this);
        this.hideCreateGroupModal = this.hideCreateGroupModal.bind(this);
        this.selectGroup = this.selectGroup.bind(this);
        this.onDeviceDrop = this.onDeviceDrop.bind(this);
        this.changeSort = this.changeSort.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
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
                                    selectGroup={this.selectGroup}
                                    onDeviceDrop={this.onDeviceDrop}
                                />
                                <DevicesContentPanel 
                                    devicesStore={devicesStore}
                                    groupsStore={groupsStore}
                                    changeSort={this.changeSort}
                                    changeFilter={this.changeFilter}
                                />
                            </span>
                        
                    :
                        <div className="wrapper-center">
                            <div className="page-intro">
                                <div>You haven't created any devices yet.</div>
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
            </span>
        );
    }
}

Devices.propTypes = {
    devicesStore: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired
}

export default Devices;