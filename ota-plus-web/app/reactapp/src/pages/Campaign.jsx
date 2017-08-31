import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { Header } from '../partials';
import { CampaignContainer } from '../containers';
import { translate } from 'react-i18next';
import { Loader } from '../partials';
import _ from 'underscore';

const title = "Campaign";

@observer
class Campaign extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        this.props.campaignsStore.fetchCampaign(this.props.params.id);
        this.props.groupsStore.fetchGroups();
    }
    componentWillUnmount() {
        this.props.campaignsStore._reset();
        this.props.groupsStore._reset();
    }
    render() {
        const { t, campaignsStore, groupsStore, backButtonAction, devicesStore } = this.props;
        let title = '';
        if(!_.isEmpty(campaignsStore.campaign)) {
            title = campaignsStore.campaign.name ? campaignsStore.campaign.name : campaignsStore.campaign.meta.name;
        }
        return (
            <FadeAnimation 
                display="flex">
                <div className="wrapper-flex">
                    <Header
                        title={title}
                        backButtonShown={true}
                        backButtonAction={backButtonAction}
                    />
                    <MetaData
                        title={title}>
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