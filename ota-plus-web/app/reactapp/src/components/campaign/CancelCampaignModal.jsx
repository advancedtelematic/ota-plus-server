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
        this.props.campaignsStore.cancelCampaign(this.props.campaign.id);        
    }
    handleResponse() {
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
                title={
                    <div className="heading red">
                        <div className="internal">
                            You're about to cancel a campaign
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
    campaign: PropTypes.object.isRequired,
    campaignsStore: PropTypes.object.isRequired,
}

export default translate()(CancelCampaignModal);