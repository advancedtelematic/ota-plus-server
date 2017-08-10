import React, { Component, PropTypes } from 'react';
import { observable, observe } from 'mobx';
import { observer } from 'mobx-react';
import { Loader } from '../../../../partials';
import GroupsListItem from './GroupsListItem';
import _ from 'underscore';
import { InfiniteScroll } from '../../../../utils';

const headerHeight = 28;

@observer
class GroupsList extends Component {
    @observable fakeHeaderLetter = null;
    @observable fakeHeaderTopPosition = 0;

    constructor(props) {
        super(props);
        this.generatePositions = this.generatePositions.bind(this);
        this.listScroll = this.listScroll.bind(this);
        this.groupsChangeHandler = observe(props.groupsStore, (change) => {
            if(change.name === 'preparedGroups' && !_.isMatch(change.oldValue, change.object[change.name])) {
                const that = this;
                  setTimeout(() => {
                      if(that.refs.list)
                          that.refs.list.scrollTop = 0;
                      that.listScroll();
                  }, 50);
            }
        });
    }
    componentDidMount() {
        this.refs.list.addEventListener('scroll', this.listScroll);
        this.listScroll();
    }
    componentWillUnmount() {
        this.groupsChangeHandler();
        this.refs.list.removeEventListener('scroll', this.listScroll);
    }
    generatePositions() {
        const headers = this.refs.list.getElementsByClassName('header');
        const wrapperPosition = this.refs.list.getBoundingClientRect();
        let positions = [];
        _.each(headers, (header) => {
            let position = header.getBoundingClientRect().top - wrapperPosition.top + this.refs.list.scrollTop;
            positions.push(position);
        }, this);
        return positions;
    }
    listScroll() {
        if(this.refs.list) {
            let scrollTop = this.refs.list.scrollTop;
            let newFakeHeaderLetter = this.fakeHeaderLetter;
            const positions = this.generatePositions();
            _.each(positions, (position, index) => {
                if(scrollTop >= position) {
                    newFakeHeaderLetter = Object.keys(this.props.groupsStore.preparedGroups)[index];
                    return true;
                } else if(scrollTop >= position - headerHeight) {
                    scrollTop -= scrollTop - (position - headerHeight);
                    return true;
                }
            }, this);
            this.fakeHeaderLetter = newFakeHeaderLetter;
            this.fakeHeaderTopPosition = scrollTop;
        }
    }
    render() {
        const { chosenGroups, setWizardData, groupsStore } = this.props;
        return (
            <div className="ios-list" ref="list">
                <InfiniteScroll
                    className="wrapper-infinite-scroll"
                    hasMore={groupsStore.groupsCurrentPage < groupsStore.groupsTotalCount / groupsStore.groupsLimit}
                    isLoading={groupsStore.groupsFetchAsync.isFetching}
                    useWindow={false}
                    loadMore={() => {
                        groupsStore.fetchGroups()
                    }}
                >
                    {groupsStore.groupsFetchAsync.isFetching ? 
                        <div className="wrapper-center">
                            <Loader />
                        </div>
                    :
                        <span>
                            <div className="fake-header" style={{top: this.fakeHeaderTopPosition}}>
                                {this.fakeHeaderLetter}
                            </div>
                            
                            {_.map(groupsStore.preparedGroups, (groups, letter) => {
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
                                                        groupsStore={groupsStore}
                                                        isChosen={chosenGroups.indexOf(group.id) > -1}
                                                    /> 
                                                </span>
                                            );
                                        })}
                                    </span>
                                );
                            })}
                        </span>
                    }
                </InfiniteScroll>
            </div>
        );
    }
}

GroupsList.propTypes = {
    chosenGroups: PropTypes.object.isRequired,
    setWizardData: PropTypes.func.isRequired,
    groupsStore: PropTypes.object.isRequired
}

export default GroupsList;

