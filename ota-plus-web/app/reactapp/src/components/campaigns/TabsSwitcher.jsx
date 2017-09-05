import React, { PropTypes, Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { CampaignsLegacyList } from './legacy';
import { CampaignsTufList } from './tuf';
import { Tabs, Tab } from 'material-ui/Tabs';

@observer
class TabsSwitcher extends Component {
    @observable activeTabId = 0;
    @observable bottomBorderColor = '#9ce2d8';

    constructor(props) {
        super(props);
        this.setQueueModalActiveTabId = this.setQueueModalActiveTabId.bind(this);
    }
    componentWillMount() {
        if(this.props.otaPlusMode) {
            this.bottomBorderColor = '#fa9872';
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
        const { campaignsStore, groupsStore, showRenameModal, goToCampaignDetails, onHomePage } = this.props;

        return (
            <span className="content-container">
                <Tabs
                    tabItemContainerStyle={{backgroundColor: 'transparent'}}
                    className="campaign-tabs"
                    inkBarStyle={{display: 'none'}}
                    onChange={this.setQueueModalActiveTabId}
                    tabItemContainerStyle={{borderBottom: '5px solid ' + this.bottomBorderColor, backgroundColor: 'transparent', height: '50px'}}
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
                                showRenameModal={showRenameModal}
                                goToCampaignDetails={goToCampaignDetails}
                                onHomePage={onHomePage}
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
                                onHomePage={onHomePage}
                            /> 
                        </div>
                    </Tab>
                </Tabs>
            </span>
        );
    }
}

TabsSwitcher.propTypes = {    
}

export default TabsSwitcher;