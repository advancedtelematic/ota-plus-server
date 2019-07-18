/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import ListItemArtificial from './ListItemArtificial';

@inject('stores')
@observer
class ArtificialList extends Component {
  constructor(props) {
    super(props);
    const { t } = props;
    this.groupsArtificial = [
      {
        name: 'all',
        devicesCount: null,
        friendlyName: t('groups.all_devices'),
        identifier: 'all-devices',
        id: null,
        isDND: false,
      },
      {
        name: 'ungrouped',
        devicesCount: null,
        friendlyName: t('groups.ungrouped_devices'),
        identifier: 'ungrouped-devices',
        id: 'ungrouped',
        isDND: true,
      },
    ];
  }

  render() {
    const { onDeviceDrop, selectGroup, stores } = this.props;
    const { groupsStore } = stores;

    return (
      <div className="groups-panel__artificial-list">
        {_.map(this.groupsArtificial, (group) => {
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
  }
}


ArtificialList.propTypes = {
  stores: PropTypes.shape({}),
  selectGroup: PropTypes.func.isRequired,
  onDeviceDrop: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(ArtificialList);
