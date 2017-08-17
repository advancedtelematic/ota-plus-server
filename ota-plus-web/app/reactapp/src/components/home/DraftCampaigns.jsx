import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader } from '../../partials';
import { resetAsync } from '../../utils/Common';
import _ from 'underscore';
import DraftCampaignsItem from './DraftCampaignsItem';
import { CampaignsCreateModal, CampaignsWizard } from '../campaigns';
import { FlatButton } from 'material-ui';

@observer
class DraftCampaigns extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { campaignsStore, packagesStore, groupsStore, addNewWizard } = this.props;
        const { lastDraftCampaigns } = campaignsStore;
        return (
            <span>
                {campaignsStore.campaignsFetchAsync.isFetching || groupsStore.groupsFetchAsync.isFetching ?
                    <div className="wrapper-center">
                        <Loader 
                            className="dark"
                        />
                    </div>
                :
                    Object.keys(lastDraftCampaigns).length ? 
                        _.map(lastDraftCampaigns, (campaign) => {
                            return (
                                <DraftCampaignsItem 
                                    key={campaign.id}
                                    campaign={campaign}
                                />
                            );
                        })
                    :
                        <div className="wrapper-center">
                            <FlatButton
                                label="Add new campaign"
                                type="button"
                                className="btn-main btn-small"
                                onClick={addNewWizard.bind(this, null)}
                            />
                        </div>
                }
            </span>
        );
    }
}

DraftCampaigns.propTypes = {
    campaignsStore: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired
}

export default DraftCampaigns;