import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import ListItem from './ListItem';
import { InfiniteScroll } from '../../utils';
import { VelocityTransitionGroup } from 'velocity-react';
import { Loader } from '../../partials';

@inject("stores")
@observer
class List extends Component {
    render() {
        const { selectGroup, onDeviceDrop } = this.props;
        const { groupsStore } = this.props.stores;
        return (
            <span>
                <VelocityTransitionGroup
                    enter={{
                        animation: "slideDown",
                    }}
                    leave={{
                        animation: "slideUp",
                        duration: 400
                    }}
                    component="span"
                >
                    <div className="groups-panel__default-list">
                        {groupsStore.groupsFetchAsync.isFetching ?
                            <div className="wrapper-center">
                                <Loader />
                            </div>
                            :
                            <InfiniteScroll
                                className="wrapper-infinite-scroll"
                                hasMore={groupsStore.hasMoreGroups}
                                isLoading={groupsStore.groupsFetchAsync.isFetching}
                                useWindow={false}
                                loadMore={() => {
                                    groupsStore.loadMoreGroups()
                                }}>
                                {!_.isEmpty(groupsStore.preparedGroups) ?
                                    _.map(groupsStore.preparedGroups, (groups) => {
                                        return _.map(groups, (group, index) => {
                                            const isSelected = (groupsStore.selectedGroup.type === 'real' && groupsStore.selectedGroup.groupName === group.groupName);
                                            let isSmart = false;
                                            if (group.groupType === 'dynamic') {
                                                isSmart = true;
                                            }
                                            return (
                                                <div>
                                                    <ListItem
                                                        group={group}
                                                        selectGroup={selectGroup}
                                                        isSelected={isSelected}
                                                        onDeviceDrop={onDeviceDrop}
                                                        key={group.groupName}
                                                        isSmart={isSmart}
                                                    />
                                                </div>
                                            );
                                        });
                                    })
                                    :
                                    null
                                }
                            </InfiniteScroll>
                        }
                    </div>
                </VelocityTransitionGroup>
            </span>
        );
    }
};

List.propTypes = {
    stores: PropTypes.object,
    selectGroup: PropTypes.func.isRequired,
    onDeviceDrop: PropTypes.func.isRequired,
}

export default List;