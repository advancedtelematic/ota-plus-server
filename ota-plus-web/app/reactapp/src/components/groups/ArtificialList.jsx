import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import ListItemArtificial from './ListItemArtificial';

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

const ArtificialList = inject("stores")(observer(({ selectGroup, onDeviceDrop, stores }) => {
    const { devicesStore, groupsStore } = stores;

    return (
        <div className="groups-panel__artificial-list">
            {_.map(groupsArtificial, (group) => {
                const isSelected = (groupsStore.selectedGroup.type === 'artificial' && groupsStore.selectedGroup.groupName === group.name);
                let deviceCount = 0;
                if (group.name === 'all') {
                    deviceCount = devicesStore.devicesInitialTotalCount;
                } else if (group.name === 'ungrouped') {
                    deviceCount = devicesStore.ungroupedDevicesInitialTotalCount;
                }
                return (
                    <ListItemArtificial
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
        </div>
    );
}));

ArtificialList.propTypes = {
    stores: PropTypes.object,
    selectGroup: PropTypes.func.isRequired,
    onDeviceDrop: PropTypes.func.isRequired,
}

export default ArtificialList;