import React, { PropTypes, Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader } from '../partials';
import { resetAsync } from '../utils/Common';
import { CampaignGroupsList, CampaignCancelCampaignModal, CampaignCancelGroupModal } from '../components/campaign';

import { translate } from 'react-i18next';
import { CampaignTuf, CampaignLegacy } from '../components/campaign';
import _ from 'underscore';

@observer
class Campaign extends Component {
    @observable cancelCampaignModalShown = false;
    @observable cancelGroupModalShown = false;
    @observable updateRequestToCancel = {};

    constructor(props) {
        super(props);
        this.showCancelCampaignModal = this.showCancelCampaignModal.bind(this);
        this.hideCancelCampaignModal = this.hideCancelCampaignModal.bind(this);
        this.showCancelGroupModal = this.showCancelGroupModal.bind(this);
        this.hideCancelGroupModal = this.hideCancelGroupModal.bind(this);
    }
    showCancelCampaignModal(e) {
        if(e) e.preventDefault();
        this.cancelCampaignModalShown = true;
    }
    hideCancelCampaignModal(e) {
        if(e) e.preventDefault();
        this.cancelCampaignModalShown = false;
        resetAsync(this.props.campaignsStore.campaignsCancelAsync);
    }
    showCancelGroupModal(updateRequest, e) {
        if(e) e.preventDefault();
        this.cancelGroupModalShown = true;
        this.updateRequestToCancel = updateRequest;
    }
    hideCancelGroupModal(e) {
        if(e) e.preventDefault();
        this.cancelGroupModalShown = false;
        this.updateRequestToCancel = {};
        resetAsync(this.props.campaignsStore.campaignsCancelRequestAsync);
    }
    render() {
        const { campaignsStore, groupsStore } = this.props;
        return (
            <span>
                {campaignsStore.campaignsOneFetchAsync.isFetching || campaignsStore.campaignsOneStatisticsFetchAsync.isFetching || groupsStore.groupsFetchAsync.isFetching ?
                    <div className="wrapper-center white-bg">
                        <Loader />
                    </div>
                :
                    campaignsStore.campaign.isLegacy ?
                        <CampaignLegacy 
                            campaignsStore={campaignsStore}
                            groupsStore={groupsStore}
                            showCancelGroupModal={this.showCancelGroupModal}
                        />
                    :
                        <CampaignTuf 
                            campaignsStore={campaignsStore}
                            groupsStore={groupsStore}
                            showCancelGroupModal={this.showCancelGroupModal}
                        />
                }
                <CampaignCancelCampaignModal
                    shown={this.cancelCampaignModalShown}
                    hide={this.hideCancelCampaignModal}
                    campaignsStore={campaignsStore}
                    campaign={campaignsStore.campaign}
                />
                <CampaignCancelGroupModal
                    shown={this.cancelGroupModalShown}
                    hide={this.hideCancelGroupModal}
                    campaign={campaignsStore.campaign}
                    campaignsStore={campaignsStore}
                    updateRequest={this.updateRequestToCancel}
                />
            </span>
        );
    }
}

Campaign.propTypes = {
    campaignsStore: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired,
    devicesStore: PropTypes.object.isRequired
}

export default translate()(Campaign);