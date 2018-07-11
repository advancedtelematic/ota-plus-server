import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import TufGroupsListItem from './TufGroupsListItem';

@observer
class TufGroupsList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { campaignsStore } = this.props;
        return (
            <div className="groups">
                {_.map(campaignsStore.campaign.groupObjects, (group, index) => {
                    let groupStat = _.find(campaignsStore.campaign.statistics.stats, (stat, gId) => {
                        return gId === group.id;
                    });
                    return (
                        <TufGroupsListItem
                            group={group.id}
                            campaign={campaignsStore.campaign}
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
    campaignsStore: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired
}

export default TufGroupsList;