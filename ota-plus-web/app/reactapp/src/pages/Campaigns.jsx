import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { CampaignsContainer } from '../containers';
import { translate } from 'react-i18next';

const title = "Campaigns";

@observer
class Campaigns extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        this.props.campaignsStore.fetchCampaigns();
        this.props.groupsStore.fetchGroups();
    }
    componentWillUnmount() {
        this.props.campaignsStore._reset();
        this.props.packagesStore._reset();
        this.props.groupsStore._reset();
    }
    render() {
        const { t, campaignsStore, packagesStore, groupsStore, hardwareStore, devicesStore, addNewWizard, otaPlusMode } = this.props;
        return (
            <FadeAnimation 
                display="flex">
                <div className="wrapper-flex">
                    <MetaData 
                        title={title}>
                        <CampaignsContainer 
                            campaignsStore={campaignsStore}
                            packagesStore={packagesStore}
                            groupsStore={groupsStore}
                            hardwareStore={hardwareStore}
                            devicesStore={devicesStore}
                            addNewWizard={addNewWizard}
                            otaPlusMode={otaPlusMode}
                            highlightedCampaign={this.props.params.campaignName}
                        />
                    </MetaData>
                </div>
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