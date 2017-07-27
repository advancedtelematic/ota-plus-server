import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import GroupsListItem from './GroupsListItem';

@observer
class GroupsList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { showCancelGroupModal, campaignsStore, groupsStore } = this.props;
        return (
            <div className="container">
                <table className="table table-fixed">
                    <tbody>
                        {_.map(campaignsStore.campaign.groups, (groupId, index) => {
                            const foundGroup = _.findWhere(groupsStore.groups, {id: groupId});
                            let groupStat = _.find(campaignsStore.campaign.statistics.stats, (stat, gId) => {
                                return gId === groupId;
                            });
                            return (
                                <GroupsListItem
                                    group={groupId}
                                    campaign={campaignsStore.campaign}
                                    statistics={groupStat}
                                    foundGroup={foundGroup}
                                    showCancelGroupModal={showCancelGroupModal}
                                    key={index}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

GroupsList.propTypes = {
    showCancelGroupModal: PropTypes.func.isRequired,
    campaignsStore: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired
}

export default GroupsList;