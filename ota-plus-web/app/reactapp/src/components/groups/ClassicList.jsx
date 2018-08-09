import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { FlatButton } from 'material-ui';
import _ from 'underscore';
import ListItem from './ListItem';
import ListItemArtificial from './ListItemArtificial';
import { InfiniteScroll } from '../../utils';
import { VelocityTransitionGroup } from 'velocity-react';
import { Loader } from '../../partials';

@inject("stores")
@observer
class ClassicList extends Component {
    @observable classicShown = true;

    constructor(props) {
        super(props);
        this.toggleClassicGroups = this.toggleClassicGroups.bind(this);
    }
    toggleClassicGroups() {
        this.classicShown = !this.classicShown;
    }
    render() {
        const { selectGroup, onDeviceDrop } = this.props;
        const { devicesStore, groupsStore } = this.props.stores;
        return (
            <span>
                <div className="groups-panel__section-title" onClick={this.toggleClassicGroups}>
                    Classic Groups <i className={`fa ${this.classicShown ? 'fa-angle-up' : 'fa-angle-down'}`}/>
                </div>
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
                    {this.classicShown ?
                        <div className="groups-panel__classic-list">
                            {groupsStore.groupsFetchAsync.isFetching ?
                                <div className="wrapper-center">
                                    <Loader />
                                </div>
                            :
                                <InfiniteScroll
                                    className="wrapper-infinite-scroll"
                                    hasMore={groupsStore.shouldLoadMore && groupsStore.hasMoreGroups}
                                    isLoading={groupsStore.groupsFetchAsync.isFetching}
                                    useWindow={false}
                                    threshold={100}
                                    loadMore={() => {
                                        groupsStore.loadMoreGroups()
                                    }}>
                                        {!_.isEmpty(groupsStore.preparedGroups) ?
                                            _.map(groupsStore.preparedGroups, (groups) => {
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
                                            })
                                        :
                                            <div className="wrapper-center">
                                                <div className="groups-panel__section-title">
                                                    No classic groups found.
                                                </div>
                                            </div>
                                        }
                                </InfiniteScroll>
                            }
                        </div>
                    :
                        null
                    }
                </VelocityTransitionGroup>
            </span>
        );
    }
};

ClassicList.propTypes = {
    stores: PropTypes.object,
    selectGroup: PropTypes.func.isRequired,
    onDeviceDrop: PropTypes.func.isRequired,
}

export default ClassicList;