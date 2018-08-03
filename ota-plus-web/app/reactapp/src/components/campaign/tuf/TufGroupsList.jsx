import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import TufGroupsListItem from './TufGroupsListItem';

@inject("stores")
@observer
class TufGroupsList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { campaignsStore } = this.props.stores;
        const { campaign } = campaignsStore;
        return (
            <div className="groups">
                {_.map(campaign.groups, (group, index) => {
                    let groupStat = _.find(campaign.statistics.stats, (stat, gId) => {
                        return gId === group.id;
                    });
                    return (
                        <TufGroupsListItem
                            group={group.id}
                            campaign={campaign}
                            statistics={groupStat}
                            foundGroup={group}
                            key={index}
                        />
                    );
                })}
            </div>
        );
    }
}

TufGroupsList.propTypes = {
    stores: PropTypes.object,
}

export default TufGroupsList;