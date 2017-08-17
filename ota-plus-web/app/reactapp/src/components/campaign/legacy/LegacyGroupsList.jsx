import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import LegacyGroupsListItem from './LegacyGroupsListItem';

@observer
class LegacyGroupsList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { showCancelGroupModal, campaignsStore, groupsStore } = this.props;
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>
                            Name
                        </th>
                        <th>
                            Status
                        </th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {_.map(campaignsStore.campaign.groups, (group, index) => {
                        const foundGroup = _.findWhere(groupsStore.groups, {id: group.group});
                        const statistics = _.findWhere(campaignsStore.campaign.statistics, {groupId: group.group});
                        return (
                            <LegacyGroupsListItem 
                                group={group}
                                statistics={statistics}
                                foundGroup={foundGroup}
                                showCancelGroupModal={showCancelGroupModal}
                                key={index}
                            />
                        );
                    })}
                </tbody>
            </table>
        );
    }
}

LegacyGroupsList.propTypes = {
    showCancelGroupModal: PropTypes.func.isRequired,
    campaignsStore: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired
}

export default LegacyGroupsList;