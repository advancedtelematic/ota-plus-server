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
class SmartList extends Component {
    @observable smartShown = true;

    constructor(props) {
        super(props);
        this.toggleSmartGroups = this.toggleSmartGroups.bind(this);
    }
    toggleSmartGroups() {
        this.smartShown = !this.smartShown;
    }
    render() {
        const { selectGroup, onDeviceDrop } = this.props;
        const { devicesStore, groupsStore } = this.props.stores;
        return (
            <span>
                <div className="groups-panel__section-title groups-panel__section-title--space-top" onClick={this.toggleSmartGroups}>
                    Smart Groups <i className={`fa ${this.smartShown ? 'fa-angle-up' : 'fa-angle-down'}`}/>
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
                    {this.smartShown ?
                        <div className="groups-panel__smart-list">
                            {groupsStore.groupsFetchAsync.isFetching ?
                                <div className="wrapper-center">
                                    <Loader />
                                </div>
                            : groupsStore.smartGroups.length ?
                                _.map(groupsStore.smartGroups, (group) => {
                                    const isSelected = (groupsStore.selectedGroup.type === 'real' && groupsStore.selectedGroup.groupName === group.groupName);
                                    return (
                                        <ListItem 
                                            group={group}
                                            selectGroup={selectGroup}
                                            isSelected={isSelected}
                                            onDeviceDrop={onDeviceDrop}
                                            isSmart={true}
                                            key={group.groupName}
                                        />
                                    );
                                })
                            :
                                <div className="wrapper-center">
                                    <div className="groups-panel__section-title">
                                        No smart groups found.
                                    </div>
                                </div>
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

SmartList.propTypes = {
    stores: PropTypes.object,
}

export default SmartList;