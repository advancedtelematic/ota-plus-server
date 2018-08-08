import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { Modal, AsyncResponse } from '../../partials';
import { AsyncStatusCallbackHandler } from '../../utils';
import { FlatButton } from 'material-ui';
import { translate } from 'react-i18next';
import _ from 'underscore';

@inject("stores")
@observer
class CancelCampaignModal extends Component {
    constructor(props) {
        super(props);
        const { campaignsStore } = props.stores;
        this.cancelHandler = new AsyncStatusCallbackHandler(campaignsStore, 'campaignsCancelAsync', this.handleResponse.bind(this));
    }
    componentWillUnmount() {
        this.cancelHandler();
    }
    cancelCampaign() {
        const { campaignsStore } = this.props.stores;
        const { campaign } = campaignsStore;
        campaignsStore.cancelCampaign(campaign.id);        
    }
    handleResponse() {
        const { campaignsStore } = this.props.stores;
        campaignsStore.fetchCampaigns('campaignsSafeFetchAsync');
        this.props.hide();
    }
    render() {
        const { t, shown, hide } = this.props;
        const { campaignsStore } = this.props.stores;
        const { campaign } = campaignsStore;
        const content = (
            !_.isEmpty(campaign) ?
                <span>
                    <AsyncResponse 
                        handledStatus="error"
                        action={campaignsStore.campaignsCancelAsync}
                        errorMsg={(campaignsStore.campaignsCancelAsync.data ? campaignsStore.campaignsCancelAsync.data.description : null)}
                    />
                    <div className="element-box campaign">
                        <div className="icon"></div>
                        <div className="desc">
                            <div className="title" id="cancel-all-campaign-name">
                                {campaign.name}
                            </div>
                            <div className="subtitle">
                                {t('common.deviceWithCount', {count: campaignsStore.overallCampaignStatistics.devicesCount})}
                            </div>
                        </div>
                    </div>
                    <span>
                        This campaign will not be executed on any further devices, <br />
                        and will be moved to <strong>Finished</strong>.
                    </span>
                    <div className="body-actions">
                        <button
                            className="btn-primary"
                            id="cancel-all-confirm"
                            onClick={this.cancelCampaign.bind(this)}
                        >
                            Confirm
                        </button>
                    </div>
                </span>
            :
                <span />
        );
        return (
            <Modal 
                title={"You're about to cancel a campaign"}
                topActions={
                    <div className="top-actions flex-end">
                        <div className="modal-close" onClick={hide}>
                            <img src="/assets/img/icons/close.svg" alt="Icon" />
                        </div>
                    </div>
                }
                content={content}
                shown={shown}
                className="cancel-campaign-modal"
            />
        );
    }
}

CancelCampaignModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    stores: PropTypes.object
}

export default translate()(CancelCampaignModal);