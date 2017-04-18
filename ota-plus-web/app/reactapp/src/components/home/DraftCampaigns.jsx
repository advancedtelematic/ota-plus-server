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
    @observable createModalShown = false;
    @observable campaignIdToAction = null;
    @observable wizardShown = false;

    constructor(props) {
        super(props);
        this.showCreateModal = this.showCreateModal.bind(this);
        this.hideCreateModal = this.hideCreateModal.bind(this);
        this.showWizard = this.showWizard.bind(this);
        this.hideWizard = this.hideWizard.bind(this);
    }
    showCreateModal(e) {
        if(e) e.preventDefault();
        this.createModalShown = true;
    }
    hideCreateModal(createdCampaignId, e) {
        if(e) e.preventDefault();
        this.createModalShown = false;
        resetAsync(this.props.campaignsStore.campaignsCreateAsync);
        this.showWizard(createdCampaignId);
    }
    showWizard(campaignId, e) {
        if(e) e.preventDefault();
        this.wizardShown = true;
        this.campaignIdToAction = campaignId;
    }
    hideWizard(e) {
        if(e) e.preventDefault();
        this.wizardShown = false;
        this.campaignIdToAction = null;
    }
    render() {
        const { campaignsStore, packagesStore, groupsStore } = this.props;
        const { lastDraftCampaigns } = campaignsStore;
        return (
            <span>
                {campaignsStore.campaignsFetchAsync.isFetching ?
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
                                    showWizard={this.showWizard}
                                />
                            );
                        })
                    :
                        <div className="wrapper-center">
                            <FlatButton
                                label="Add new campaign"
                                type="button"
                                className="btn-main btn-small"
                                onClick={this.showCreateModal}
                            />
                        </div>
                }
                <CampaignsCreateModal 
                    shown={this.createModalShown}
                    hide={this.hideCreateModal}
                    campaignsStore={campaignsStore}
                />
                <CampaignsWizard 
                    shown={this.wizardShown}
                    hide={this.hideWizard}
                    campaignsStore={campaignsStore}
                    packagesStore={packagesStore}
                    groupsStore={groupsStore}
                    campaignId={this.campaignIdToAction}
                />
            </span>
        );
    }
}

DraftCampaigns.propTypes = {
    campaignsStore: PropTypes.object,
    packagesStore: PropTypes.object,
    groupsStore: PropTypes.object
}

export default DraftCampaigns;