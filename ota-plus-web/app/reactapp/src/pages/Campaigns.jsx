import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { CampaignsContainer } from '../containers';
import { translate } from 'react-i18next';

const title = "Campaigns";

@inject("stores")
@observer
class Campaigns extends Component {
    componentWillMount() {
        const { campaignsStore, groupsStore } = this.props.stores;
        campaignsStore.fetchCampaigns();
        groupsStore.fetchGroups();
    }
    componentWillUnmount() {
        const { campaignsStore, packagesStore, groupsStore } = this.props.stores;
        campaignsStore._reset();
        packagesStore._reset();
        groupsStore._reset();
    }
    render() {
        const { t, addNewWizard } = this.props;
        return (
            <FadeAnimation>
                <MetaData 
                    title={title}>
                    <CampaignsContainer 
                        highlightedCampaign={this.props.params.campaignName}
                        addNewWizard={addNewWizard}
                    />
                </MetaData>
            </FadeAnimation>
        );
    }
}

Campaigns.propTypes = {
    campaignsStore: PropTypes.object,
    packagesStore: PropTypes.object,
    groupsStore: PropTypes.object,
    hardwareStore: PropTypes.object
}

export default translate()(Campaigns);