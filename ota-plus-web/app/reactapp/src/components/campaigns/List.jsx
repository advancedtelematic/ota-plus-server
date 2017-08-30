import React, { PropTypes, Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import moment from 'moment';
import _ from 'underscore';
import { Loader } from '../../partials';
import CampaignsHeader from './Header';
import { CampaignsLegacyList } from './legacy';
import { CampaignsTufList } from './tuf';
import { Tabs, Tab } from 'material-ui/Tabs';

@observer
class List extends Component {
    @observable activeTabId = 0;

    constructor(props) {
        super(props);
        this.setQueueModalActiveTabId = this.setQueueModalActiveTabId.bind(this);
    }
    setQueueModalActiveTabId(value) {
        this.activeTabId = value;
    }
    render() {
        const { campaignsStore, groupsStore, addNewWizard, showWizard, showRenameModal, goToCampaignDetails } = this.props;

        return (
            <span>
                <CampaignsHeader
                    addNewWizard={addNewWizard}
                />
                <span className="content-container">
                    <Tabs
                        tabItemContainerStyle={{backgroundColor: 'transparent'}}
                        className="campaign-tabs"
                        inkBarStyle={{display: 'none'}}
                        onChange={this.setQueueModalActiveTabId}
                        tabItemContainerStyle={{borderBottom: '5px solid #9ce2d8', backgroundColor: 'transparent', height: '50px'}}
                        contentContainerClassName={'campaigns-wrapper'}
                        tabTemplateStyle={{height: '100%'}}
                    >
                        <Tab
                            label="Multi-targets campaigns"
                            className={"tab-item" + (this.activeTabId === 0 ? " active" : "")}
                            id="multi-target-campaigns"
                            value={0}
                        >
                            <div className={"wrapper-list" + (this.activeTabId === 1 ? " hide" : "")}>
                                <CampaignsTufList 
                                    campaignsStore={campaignsStore}
                                    groupsStore={groupsStore}
                                    addNewWizard={addNewWizard}
                                    showWizard={showWizard}
                                    showRenameModal={showRenameModal}
                                    goToCampaignDetails={goToCampaignDetails}
                                />
                            </div>
                        </Tab>
                        <Tab
                            label="Single package campaigns" 
                            className={"tab-item" + (this.activeTabId === 1 ? " active" : "")}
                            id="single-package-campaigns"
                            value={1}
                        >
                            <div className={"wrapper-list" + (this.activeTabId === 0 ? " hide" : "")}>
                                <CampaignsLegacyList 
                                    campaignsStore={campaignsStore}
                                    groupsStore={groupsStore}
                                    showRenameModal={showRenameModal}
                                    goToCampaignDetails={goToCampaignDetails}
                                /> 
                            </div>
                        </Tab>
                    </Tabs>
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