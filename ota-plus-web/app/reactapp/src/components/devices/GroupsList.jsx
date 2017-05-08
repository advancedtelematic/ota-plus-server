import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { FlatButton } from 'material-ui';
import _ from 'underscore';
import { GroupsListItem, GroupsListItemArtificial } from '../groups';

const groupsArtificial = [
    {
        name: 'all',
        devicesCount: null,
        friendlyName: 'All devices',
        identifier: 'all-devices',
        id: null,
        isDND: false
    },
    {
        name: 'ungrouped',
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
        devicesStore.fetchDevices(devicesStore.devicesFilter, groupId);        
    }
    render() {
        const { devicesStore, groupsStore, showRenameGroupModal, selectGroup, onDeviceDrop } = this.props;
        return (
            <div className="wrapper-groups">
                {_.map(groupsArtificial, (group) => {
                    const isSelected = (groupsStore.selectedGroup.type === 'artificial' && groupsStore.selectedGroup.name === group.name);
                    let deviceCount = 0;
                    let groupDevicesCount = 0;
                    if(group.name === 'all') {
                        deviceCount = devicesStore.devicesInitialTotalCount;
                    } else if(group.name === 'ungrouped') {
                        _.each(groupsStore.groups, (group) => {
                            _.each(group.devices, (device) => {
                                groupDevicesCount++;
                            });
                        });
                        deviceCount = devicesStore.devicesInitialTotalCount - groupDevicesCount;
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
                {_.map(groupsStore.groups, (group) => {
                    const isSelected = (groupsStore.selectedGroup.type === 'real' && groupsStore.selectedGroup.name === group.groupName);
                    return (
                        <GroupsListItem 
                            group={group}
                            showRenameGroupModal={showRenameGroupModal}
                            selectGroup={selectGroup}
                            isSelected={isSelected}
                            onDeviceDrop={onDeviceDrop}
                            key={group.groupName}
                        />
                    );
                })}
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