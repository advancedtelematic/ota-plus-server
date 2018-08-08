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
class AutomaticList extends Component {
    @observable automaticShown = true;

    constructor(props) {
        super(props);
        this.toggleAutomaticGroups = this.toggleAutomaticGroups.bind(this);
    }
    toggleAutomaticGroups() {
        this.automaticShown = !this.automaticShown;
    }
    render() {
        const { selectGroup, onDeviceDrop } = this.props;
        const { devicesStore, groupsStore } = this.props.stores;
        return (
            <span>
                <div className="groups-panel__section-title groups-panel__section-title--space-top" onClick={this.toggleAutomaticGroups}>
                    Automatic Groups <i className={`fa ${this.automaticShown ? 'fa-angle-up' : 'fa-angle-down'}`}/>
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
                    {this.automaticShown ?
                        <div className="groups-panel__automatic-list">
                            {groupsStore.groupsFetchAsync.isFetching ?
                                <div className="wrapper-center">
                                    <Loader />
                                </div>
                            : groupsStore.automaticGroups.length ?
                                _.map(groupsStore.automaticGroups, (group) => {
                                    const isSelected = (groupsStore.selectedGroup.type === 'real' && groupsStore.selectedGroup.groupName === group.groupName);
                                    return (
                                        <ListItem 
                                            group={group}
                                            selectGroup={selectGroup}
                                            isSelected={isSelected}
                                            onDeviceDrop={onDeviceDrop}
                                            isAutomatic={true}
                                            key={group.groupName}
                                        />
                                    );
                                })
                            :
                                <div className="wrapper-center">
                                    <div className="groups-panel__section-title">
                                        No automatic groups found.
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

AutomaticList.propTypes = {
    stores: PropTypes.object,
}

export default AutomaticList;