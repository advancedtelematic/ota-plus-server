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
        isDND: false
    },
    {
        name: 'ungrouped',
        devicesCount: null,
        friendlyName: 'Ungrouped devices',
        isDND: true
    }
];

@observer
class GroupsList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { devicesStore, groupsStore, showRenameGroupModal, selectedGroup, selectGroup, onDeviceDrop } = this.props;
        return (
            <div className="wrapper-groups">
                {_.map(groupsArtificial, (group) => {
                    const isSelected = (selectedGroup.type === 'artificial' && selectedGroup.name === group.name);
                    let deviceCount = 0;
                    if(group.name === 'all') {
                        deviceCount = devicesStore.devicesInitialTotalCount;
                    } else if(group.name === 'ungrouped') {
                        const groupedIds = [];
                        _.each(groupsStore.groups, (group) => {
                            _.each(group.devices, (device) => {
                                if(groupedIds.indexOf(device) === -1)
                                    groupedIds.push(device);
                            });
                        });
                        deviceCount = devicesStore.devices.length - groupedIds.length;
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
                    const isSelected = (selectedGroup.type === 'real' && selectedGroup.name === group.groupName);
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
    selectedGroup: PropTypes.object.isRequired,
    selectGroup: PropTypes.func.isRequired,
    onDeviceDrop: PropTypes.func.isRequired,
}

export default GroupsList;