import React, { Component, PropTypes } from 'react';;
import { observer, inject } from 'mobx-react';
import GroupsListItem from './GroupsListItem';
import _ from 'underscore';
import { InfiniteScroll } from '../../../../utils';

@inject("stores")
@observer
class GroupsList extends Component {
    render() {
        const { chosenGroups, setWizardData } = this.props;
        const { groupsStore } = this.props.stores;
        return (
            <div className="ios-list" ref="list">
                {Object.keys(groupsStore.preparedWizardGroups).length ?
                    (
                        <InfiniteScroll
                            className="wrapper-infinite-scroll"
                            hasMore={groupsStore.hasMoreWizardGroups}
                            isLoading={groupsStore.groupsWizardFetchAsync.isFetching}
                            useWindow={false}
                            loadMore={() => {
                                groupsStore.loadMoreWizardGroups()
                            }}
                        >
                            <span>
                                {_.map(groupsStore.preparedWizardGroups, (groups, letter) => {
                                    return (
                                        <span key={letter}>
                                            <div className="header">
                                                {letter}
                                            </div>
                                            {_.map(groups, (group, index) => {
                                                return (
                                                    <span key={index}>
                                                        <GroupsListItem
                                                            group={group}
                                                            setWizardData={setWizardData}
                                                            isChosen={_.findWhere(chosenGroups, { id: group.id }) ? true : false}
                                                        />
                                                    </span>
                                                );
                                            })}
                                        </span>
                                    );
                                })}
                            </span>
                        </InfiniteScroll>
                    )
                    :
                    (
                        <div className="wrapper-center">
                            {"No groups found."}
                        </div>
                    )
                }
            </div>
        );
    }
}

GroupsList.propTypes = {
    chosenGroups: PropTypes.object.isRequired,
    setWizardData: PropTypes.func.isRequired,
    stores: PropTypes.object,
};

export default GroupsList;

