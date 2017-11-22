import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { MetaData, FadeAnimation, AsyncStatusCallbackHandler } from '../utils';
import { CampaignHeader } from '../components/campaign';
import { CampaignContainer } from '../containers';
import { translate } from 'react-i18next';
import { Loader } from '../partials';
import _ from 'underscore';

const title = "Campaign";

@observer
class Campaign extends Component {
    @observable title = '';
    @observable type = '';

    constructor(props) {
        super(props);
        this.fetchHandler = new AsyncStatusCallbackHandler(props.campaignsStore, 'campaignsOneStatisticsFetchAsync', this.handleResponse.bind(this));
    }
    componentWillMount() {
        this.props.campaignsStore.fetchCampaign(this.props.params.id);
        this.props.groupsStore.fetchGroups();
    }
    componentWillUnmount() {
        this.props.campaignsStore._reset();
        this.props.groupsStore._reset();
    }
    handleResponse() {
        const { campaign } = this.props.campaignsStore;
        if(campaign.isLegacy) {
            this.title = campaign.meta.name;
            this.campaignType = 'legacy';
        } else {
            this.title = campaign.name;
            this.campaignType = 'type';
        }
    }
    render() {
        const { t, campaignsStore, groupsStore, backButtonAction, devicesStore } = this.props;
        return (
            <FadeAnimation 
                display="flex">
                <div className="wrapper-flex">
                    <CampaignHeader
                        title={this.title}
                        backButtonShown={true}
                        backButtonAction={backButtonAction}
                        campaignsStore={campaignsStore}
                    />
                    <MetaData
                        title={this.title}
                        className={this.campaignType}>
                        <CampaignContainer
                            campaignsStore={campaignsStore}
                            groupsStore={groupsStore}
                            devicesStore={devicesStore}
                        />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

Campaign.propTypes = {
    campaignsStore: PropTypes.object,
    devicesStore: PropTypes.object
}

export default translate()(Campaign);