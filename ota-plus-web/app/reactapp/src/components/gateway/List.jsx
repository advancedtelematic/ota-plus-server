import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import GatewayListItem from './ListItem';
import GatewayListItemDetails from './ListItemDetails';
import { VelocityTransitionGroup } from 'velocity-react';

@observer
class List extends Component {
    @observable selectedGroup = null;

    constructor(props) {
        super(props);
        this.selectGroup = this.selectGroup.bind(this);
    }
    selectGroup(name, e) {
        if(e) e.preventDefault();
        this.selectedGroup = (this.selectedGroup !== name ? name : null);
    }
    render() {
        const { data } = this.props;
		return (
            <div className="gateway-list">
    			{_.map(data.groups, (item, groupName) => {
                    return (
                        <span key={groupName}>
                            <GatewayListItem
                                item={item}
                                groupName={groupName}
                                selectGroup={this.selectGroup}
                            />
                            <VelocityTransitionGroup
                                enter={{
                                    animation: "slideDown"
                                }}
                                leave={{
                                    animation: "slideUp"
                                }}
                            >
                                {this.selectedGroup === groupName ?
                                    <GatewayListItemDetails
                                        item={item}
                                    />
                                :
                                    null
                                }
                            </VelocityTransitionGroup>
                        </span>
                    );
                })};
            </div>
        );
    }
}

export default List;