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
        if (this.refs.list) {
            this.refs.list.removeEventListener('scroll', this.listScroll);
        }
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
                    newFakeHeaderLetter = Object.keys(this.props.groupsStore.preparedWizardGroups)[index];
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
                {Object.keys(groupsStore.preparedWizardGroups).length ?
                    <InfiniteScroll
                        className="wrapper-infinite-scroll"
                        hasMore={groupsStore.groupsWizardCurrentPage < groupsStore.groupsWizardTotalCount / groupsStore.groupsWizardLimit}
                        isLoading={groupsStore.groupsWizardFetchAsync.isFetching}
                        useWindow={false}
                        loadMore={() => {
                            groupsStore.fetchWizardGroups()
                        }}
                    >
                        <span>
                            <div className="fake-header" style={{top: this.fakeHeaderTopPosition}}>
                                {this.fakeHeaderLetter}
                            </div>
                            
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
                                                        groupsStore={groupsStore}
                                                        isChosen={_.findWhere(chosenGroups, {id: group.id}) ? true : false}
                                                    /> 
                                                </span>
                                            );
                                        })}
                                    </span>
                                );
                            })}
                        </span>
                    </InfiniteScroll>
                :
                    <div className="wrapper-center">
                        No groups found.
                    </div>
                }                
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

