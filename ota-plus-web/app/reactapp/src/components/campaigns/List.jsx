import React, { PropTypes, Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { CampaignsLegacyList } from './legacy';
import { CampaignsTufList } from './tuf';
import CampaignsHeader from './Header';
import { Tabs, Tab } from 'material-ui/Tabs';

@observer
class List extends Component {
    @observable activeTabId = 0;
    @observable bottomBorderColor = !window.atsGarageTheme ? '#fa9872' : '#9ce2d8';
    @observable expandedCampaignName = null;

    constructor(props) {
        super(props);
        this.setQueueModalActiveTabId = this.setQueueModalActiveTabId.bind(this);
    }
    componentWillMount() {
        if(this.props.otaPlusMode) {
            this.bottomBorderColor = '#fa9872';
        }
        if(this.props.campaignsStore.preparedCampaigns.length) {
            this.setQueueModalActiveTabId(0);
        } else if(this.props.campaignsStore.preparedLegacyCampaigns.length) {
            this.setQueueModalActiveTabId(1);
        }
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.otaPlusMode) {
            this.bottomBorderColor = '#fa9872';
        } else {
            this.bottomBorderColor = '#9ce2d8';
        }
    }
    setQueueModalActiveTabId(value) {
        this.activeTabId = value;
    }
    render() {
        const { campaignsStore, groupsStore, showRenameModal, addNewWizard, highlightedCampaign, showCancelCampaignModal, showCancelGroupModal, showDependenciesModal } = this.props;
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
                        tabItemContainerStyle={{borderBottom: '5px solid ' + this.bottomBorderColor, backgroundColor: 'transparent'}}
                        contentContainerClassName={'campaigns-wrapper'}
                        tabTemplateStyle={{height: '100%'}}
                    >
                        {campaignsStore.preparedCampaigns.length ?
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
                                        showRenameModal={showRenameModal}
                                        highlightedCampaign={highlightedCampaign}
                                        showCancelCampaignModal={showCancelCampaignModal}
                                        showDependenciesModal={showDependenciesModal}
                                    />
                                </div>
                            </Tab>
                        :
                            null
                        }
                        {campaignsStore.preparedLegacyCampaigns.length ?
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
                                        showCancelCampaignModal={showCancelCampaignModal}
                                        showCancelGroupModal={showCancelGroupModal}
                                    /> 
                                </div>
                            </Tab>
                        :
                            null
                        }
                        
                    </Tabs>
                </span>
            </span>
        );
    }
}

List.propTypes = {    
}

export default List;