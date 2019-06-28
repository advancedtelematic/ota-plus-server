/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import ListItemArtificial from './ListItemArtificial';

const groupsArtificial = [
  {
    name: 'all',
    devicesCount: null,
    friendlyName: 'All devices',
    identifier: 'all-devices',
    id: null,
    isDND: false,
  },
  {
    name: 'ungrouped',
    devicesCount: null,
    friendlyName: 'Ungrouped devices',
    identifier: 'ungrouped-devices',
    id: 'ungrouped',
    isDND: true,
  },
];

const ArtificialList = inject('stores')(
  observer(({ selectGroup, onDeviceDrop, stores }) => {
    const { groupsStore } = stores;

    return (
      <div className="groups-panel__artificial-list">
        {_.map(groupsArtificial, (group) => {
          const { type, groupName } = groupsStore.selectedGroup;
          const isSelected = type === 'artificial' && groupName === group.name;
          return (
            <ListItemArtificial
              group={group}
              selectGroup={selectGroup}
              isSelected={isSelected}
              onDeviceDrop={onDeviceDrop}
              isDND={group.isDND}
              key={group.name}
            />
          );
        })}
      </div>
    );
  }),
);

ArtificialList.propTypes = {
  stores: PropTypes.shape({}),
  selectGroup: PropTypes.func.isRequired,
  onDeviceDrop: PropTypes.func.isRequired,
};

export default ArtificialList;
