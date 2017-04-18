import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Modal, AsyncResponse } from '../../partials';
import { AsyncStatusCallbackHandler } from '../../utils';
import { FlatButton } from 'material-ui';
import { translate } from 'react-i18next';
import _ from 'underscore';

@observer
class CancelGroupModal extends Component {
    constructor(props) {
        super(props);
        this.cancelHandler = new AsyncStatusCallbackHandler(props.campaignsStore, 'campaignsCancelRequestAsync', this.handleResponse.bind(this));
    }
    componentWillUnmount() {
        this.cancelHandler();
    }
    cancelCampaignRequest() {
        this.props.campaignsStore.cancelCampaignRequest(this.props.updateRequest.updateRequest);
    }
    handleResponse() {
        this.props.campaignsStore.fetchCampaign(this.props.campaign.meta.id);
        this.props.hide();
    }
    render() {
        const { t, shown, hide, campaignsStore, updateRequest, campaign } = this.props;
        const content = (
            !_.isEmpty(updateRequest) ?
                <span>
                    <AsyncResponse 
                        handledStatus="error"
                        action={campaignsStore.campaignsCancelRequestAsync}
                        errorMsg={(campaignsStore.campaignsCancelRequestAsync.data ? campaignsStore.campaignsCancelRequestAsync.data.description : null)}
                    />
                    <div className="element-box group">
                        <div className="icon"></div>
                        <div className="desc">
                            <div className="title">
                                {updateRequest.groupName}
                            </div>
                            <div className="subtitle">
                                {t('common.deviceWithCount', {count: updateRequest.deviceCount})}
                            </div>
                        </div>
                    </div>
                    <div>
                        This campaign will not be installable anymore for devices in group {updateRequest.groupName}, <br />
                        and all devices in the group will be moved to <strong>Finished</strong>.
                    </div>
                    <div className="body-actions">
                        <a href="#"
                            onClick={hide}
                            className="link-cancel">
                            Close
                        </a>
                        <FlatButton
                            label="Confirm"
                            type="submit"
                            className="btn-main"
                            onClick={this.cancelCampaignRequest.bind(this)}
                        />
                    </div>
                </span>
            :
                <span />
        );

        return (
            <Modal 
                title="You're about to cancel a campaign for group"
                content={content}
                shown={shown}
                className="cancel-campaign-group-modal"
            />
        );
    }
}

CancelGroupModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    campaign: PropTypes.object.isRequired,
    campaignsStore: PropTypes.object.isRequired,
    updateRequest: PropTypes.object.isRequired
}

export default translate()(CancelGroupModal);