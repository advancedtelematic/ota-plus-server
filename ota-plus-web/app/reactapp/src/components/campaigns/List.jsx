import React, { PropTypes, Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import _ from 'underscore';
import { Loader } from '../../partials';
import CampaignsHeader from './Header';
import { CampaignsLegacyList } from './legacy';
import { CampaignsTufList } from './tuf';

@observer
class List extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { campaignsStore, groupsStore, addNewWizard, showWizard, showRenameModal, goToCampaignDetails } = this.props;
        return (
            <span>
                <CampaignsHeader
                    addNewWizard={addNewWizard}
                />
                <span className="content-container">
                    <CampaignsLegacyList 
                        campaignsStore={campaignsStore}
                        groupsStore={groupsStore}
                        showRenameModal={showRenameModal}
                        goToCampaignDetails={goToCampaignDetails}
                    />              
                    <CampaignsTufList 
                        campaignsStore={campaignsStore}
                        groupsStore={groupsStore}
                        addNewWizard={addNewWizard}
                        showWizard={showWizard}
                        showRenameModal={showRenameModal}
                        goToCampaignDetails={goToCampaignDetails}
                    />
                </span>
            </span>
        );
    }
}

List.contextTypes = {
    router: React.PropTypes.object.isRequired
}

List.propTypes = {
    
}

export default List;