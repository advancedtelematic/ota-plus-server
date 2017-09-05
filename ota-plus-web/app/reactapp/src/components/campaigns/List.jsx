import React, { PropTypes, Component } from 'react';
import { observer } from 'mobx-react';
import CampaignsHeader from './Header';
import CampaignsTabsSwitcher from './TabsSwitcher';

@observer
class List extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { campaignsStore, groupsStore, addNewWizard, showRenameModal, goToCampaignDetails, otaPlusMode } = this.props;
        return (
            <span>
                <CampaignsHeader
                    addNewWizard={addNewWizard}
                />
                <CampaignsTabsSwitcher
                    campaignsStore={campaignsStore}
                    groupsStore={groupsStore}
                    showRenameModal={showRenameModal}
                    goToCampaignDetails={goToCampaignDetails}
                    onHomePage={false}
                    otaPlusMode={otaPlusMode}
                />
            </span>
        );
    }
}

List.propTypes = {
    
}

export default List;