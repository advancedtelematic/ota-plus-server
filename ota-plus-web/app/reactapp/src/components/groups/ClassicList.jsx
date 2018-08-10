import React, { Component, PropTypes } from 'react';
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
    render() {
        const { selectGroup, onDeviceDrop, toggleSection, expandedSection } = this.props;
        const { devicesStore, groupsStore } = this.props.stores;
        const expanded = expandedSection === 'classic';
        return (
            <span>
                <div className="groups-panel__section-title" onClick={() => { toggleSection('classic') }}>
                    Classic Groups <i className={`fa ${expanded ? 'fa-angle-down' : 'fa-angle-up'}`}/>
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
                    {expanded ?
                        <div className="groups-panel__classic-list">
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
                                        {groupsStore.classicGroups.length ?
                                           _.map(groupsStore.classicGroups, (group, index) => {
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