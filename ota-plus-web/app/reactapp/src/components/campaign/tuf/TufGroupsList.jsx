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
        const { campaignsStore, groupsStore } = this.props;
        return (
            <div className={"group-list" + (campaignsStore.campaign.statistics.status === 'launched' ? " launched" : "")}>
                {_.map(campaignsStore.campaign.groups, (groupId, index) => {
                    const foundGroup = _.findWhere(groupsStore.groups, {id: groupId});
                    let groupStat = _.find(campaignsStore.campaign.statistics.stats, (stat, gId) => {
                        return gId === groupId;
                    });
                    return (
                        <TufGroupsListItem
                            group={groupId}
                            campaign={campaignsStore.campaign}
                            statistics={groupStat}
                            foundGroup={foundGroup}
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