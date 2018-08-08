import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { FlatButton } from 'material-ui';
import _ from 'underscore';
import ListItem from './ListItem';
import ListItemArtificial from './ListItemArtificial';
import { InfiniteScroll } from '../../utils';

const List = inject("stores")(observer(({selectGroup, onDeviceDrop, stores}) => {
    const { devicesStore, groupsStore } = stores;
    return (
        <div className="groups-panel__classic-list">
            <InfiniteScroll
                    className="wrapper-infinite-scroll"
                    hasMore={groupsStore.shouldLoadMore && groupsStore.groupsCurrentPage < groupsStore.groupsTotalCount / groupsStore.groupsLimit}
                    isLoading={groupsStore.groupsFetchAsync.isFetching}
                    useWindow={false}
                    loadMore={() => {
                        groupsStore.fetchGroups()
                    }}
                >
                    {_.map(groupsStore.preparedGroups, (groups) => {
                        return _.map(groups, (group, index) => {
                            const isSelected = (groupsStore.selectedGroup.type === 'real' && groupsStore.selectedGroup.groupName === group.groupName);
                            return (
                                <ListItem 
                                    group={group}
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
}));

List.propTypes = {
    stores: PropTypes.object,
    selectGroup: PropTypes.func.isRequired,
    onDeviceDrop: PropTypes.func.isRequired,
}

export default List;