/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import GroupsListItem from './GroupsListItem';

@inject('stores')
@observer
class GroupsList extends Component {
  render() {
    const { campaignsStore } = this.props.stores;
    const { campaign } = campaignsStore;
    return (
      <div className='groups'>
        {_.map(campaign.groups, (group, index) => {
          let groupStat = _.find(campaign.statistics.stats, (stat, gId) => {
            return gId === group.id;
          });
          return <GroupsListItem group={group.id} campaign={campaign} statistics={groupStat} foundGroup={group} key={index} />;
        })}
      </div>
    );
  }
}

GroupsList.propTypes = {
  stores: PropTypes.object,
};

export default GroupsList;
