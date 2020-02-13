/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { VelocityTransitionGroup } from 'velocity-react';

import { GROUP_GROUP_TYPE_DYNAMIC, GROUP_GROUP_TYPE_REAL } from '../../constants/groupConstants';
import ListItem from './ListItem';
import { InfiniteScroll } from '../../utils';
import { Loader } from '../../partials';
import { SLIDE_ANIMATION_TYPE } from '../../constants';

const TRANSITION_DURATION_MS = 400;

@inject('stores')
@observer
class List extends Component {
  render() {
    const { selectGroup, onDeviceDrop, stores } = this.props;
    const { groupsStore } = stores;
    return (
      <span>
        <VelocityTransitionGroup
          enter={{
            animation: SLIDE_ANIMATION_TYPE.DOWN,
          }}
          leave={{
            animation: SLIDE_ANIMATION_TYPE.UP,
            duration: TRANSITION_DURATION_MS,
          }}
          component="span"
        >
          <div className="groups-panel__default-list">
            {groupsStore.groupsFetchAsync.isFetching ? (
              <div className="wrapper-center">
                <Loader />
              </div>
            ) : (
              <InfiniteScroll
                className="wrapper-infinite-scroll"
                hasMore={groupsStore.hasMoreGroups}
                isLoading={groupsStore.groupsFetchAsync.isFetching}
                useWindow={false}
                loadMore={() => {
                  groupsStore.loadMoreGroups();
                }}
              >
                {!_.isEmpty(groupsStore.preparedGroups)
                  ? _.map(groupsStore.preparedGroups, groups => _.map(groups, (group) => {
                    const { type, groupName } = groupsStore.selectedGroup;
                    const isSelected = type === GROUP_GROUP_TYPE_REAL && groupName === group.groupName;
                    let isSmart = false;
                    if (group.groupType === GROUP_GROUP_TYPE_DYNAMIC) {
                      isSmart = true;
                    }
                    return (
                      <ListItem
                        group={group}
                        selectGroup={selectGroup}
                        isSelected={isSelected}
                        onDeviceDrop={onDeviceDrop}
                        key={group.groupName}
                        isSmart={isSmart}
                      />
                    );
                  }))
                  : null}
              </InfiniteScroll>
            )}
          </div>
        </VelocityTransitionGroup>
      </span>
    );
  }
}

List.propTypes = {
  stores: PropTypes.shape({}),
  selectGroup: PropTypes.func.isRequired,
  onDeviceDrop: PropTypes.func.isRequired,
};

export default List;
