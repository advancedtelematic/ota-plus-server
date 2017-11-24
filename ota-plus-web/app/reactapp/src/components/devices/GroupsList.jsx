import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { FlatButton } from 'material-ui';
import _ from 'underscore';
import { GroupsListItem, GroupsListItemArtificial } from '../groups';
import { InfiniteScroll } from '../../utils';

const groupsArtificial = [
    {
        name: 'All',
        devicesCount: null,
        friendlyName: 'All devices',
        identifier: 'all-devices',
        id: null,
        isDND: false
    },
    {
        name: 'Ungrouped',
        devicesCount: null,
        friendlyName: 'Ungrouped devices',
        identifier: 'ungrouped-devices',
        id: 'ungrouped',
        isDND: true
    }
];

@observer
class GroupsList extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        const { devicesStore, groupsStore } = this.props;
        const selectedGroup = groupsStore.selectedGroup;
        const groupId = selectedGroup.id || null;
        devicesStore.fetchRememberedDevices(devicesStore.devicesFilter, groupId);        
    }
    render() {
        const { devicesStore, groupsStore, showRenameGroupModal, selectGroup, onDeviceDrop } = this.props;
        return (
            <div className="wrapper-groups">
            
                <InfiniteScroll
                        className="wrapper-infinite-scroll"
                        hasMore={groupsStore.groupsCurrentPage < groupsStore.groupsTotalCount / groupsStore.groupsLimit}
                        isLoading={groupsStore.groupsFetchAsync.isFetching}
                        useWindow={false}
                        loadMore={() => {
                            groupsStore.fetchGroups()
                        }}
                    >
                    {_.map(groupsArtificial, (group) => {
                        const isSelected = (groupsStore.selectedGroup.type === 'artificial' && groupsStore.selectedGroup.name === group.name);
                        let deviceCount = 0;
                        let groupDevicesCount = 0;
                        if(group.name === 'all') {
                            deviceCount = devicesStore.devicesInitialTotalCount;
                        } else if(group.name === 'ungrouped') {
                            let groupedDevicesCount = 0;
                            _.each(groupsStore.groups, (group, index) => {
                                groupedDevicesCount += group.devices.total;
                            });
                            deviceCount = devicesStore.devicesInitialTotalCount - groupedDevicesCount;
                        }
                        return (
                            <GroupsListItemArtificial
                                group={group}
                                selectGroup={selectGroup}
                                isSelected={isSelected}
                                onDeviceDrop={onDeviceDrop}
                                isDND={group.isDND}
                                deviceCount={deviceCount}
                                key={group.name}
                            />
                        );
                    })}
                    {_.map(groupsStore.preparedGroups, (groups) => {
                        return _.map(groups, (group, index) => {
                            const isSelected = (groupsStore.selectedGroup.type === 'real' && groupsStore.selectedGroup.name === group.groupName);
                            return (
                                <GroupsListItem 
                                    group={group}
                                    groupsStore={groupsStore}
                                    showRenameGroupModal={showRenameGroupModal}
                                    selectGroup={selectGroup}
                                    isSelected={isSelected}
                                    onDeviceDrop={onDeviceDrop}
                                    key={group.groupName}
                                />
                            );
                        });
                    })}
                </InfiniteScroll>

            </div>
        );
    }
}

GroupsList.propTypes = {
    devicesStore: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired,
    showRenameGroupModal: PropTypes.func.isRequired,
    selectGroup: PropTypes.func.isRequired,
    onDeviceDrop: PropTypes.func.isRequired,
}

export default GroupsList;