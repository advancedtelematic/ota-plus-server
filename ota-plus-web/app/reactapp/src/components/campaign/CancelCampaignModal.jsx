import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Modal, AsyncResponse } from '../../partials';
import { AsyncStatusCallbackHandler } from '../../utils';
import { FlatButton } from 'material-ui';
import { translate } from 'react-i18next';
import _ from 'underscore';

@observer
class CancelCampaignModal extends Component {
    constructor(props) {
        super(props);
        this.cancelHandler = new AsyncStatusCallbackHandler(props.campaignsStore, 'campaignsCancelAsync', this.handleResponse.bind(this));
    }
    componentWillUnmount() {
        this.cancelHandler();
    }
    cancelCampaign() {
        if(this.props.campaign.isLegacy) 
            this.props.campaignsStore.cancelLegacyCampaign(this.props.campaign.meta.id);
        else 
            this.props.campaignsStore.cancelCampaign(this.props.campaign.id);        
    }
    handleResponse() {
        if(this.props.campaign.isLegacy)
            this.props.campaignsStore.fetchLegacyCampaign(this.props.campaign.meta.id);
        else
            this.props.campaignsStore.fetchCampaign(this.props.campaign.id);
        this.props.hide();
    }
    render() {
        const { t, shown, hide, campaign, campaignsStore } = this.props;
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
                        <a href="#"
                            onClick={hide}
                            className="link-cancel"
                            id="cancel-all-close">
                            Close
                        </a>
                        <FlatButton
                            label="Confirm"
                            type="submit"
                            className="btn-main"
                            id="cancel-all-confirm"
                            onClick={this.cancelCampaign.bind(this)}
                        />
                    </div>
                </span>
            :
                <span />
        );
        return (
            <Modal 
                title="You're about to cancel a campaign"
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
    campaign: PropTypes.object.isRequired,
    campaignsStore: PropTypes.object.isRequired,
}

export default translate()(CancelCampaignModal);