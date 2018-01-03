import React, { PropTypes, Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { CampaignsLegacyList } from './legacy';
import { CampaignsTufList } from './tuf';
import CampaignsHeader from './Header';
import { Tabs, Tab } from 'material-ui/Tabs';
import _ from 'underscore';

const headerHeight = 28;

@observer
class List extends Component {
    @observable activeTabId = 0;
    @observable bottomBorderColor = !window.atsGarageTheme ? '#fa9872' : '#9ce2d8';
    @observable fakeHeaderLetter = '';
    @observable fakeHeaderTopPosition = 0;
    @observable expandedCampaignName = null;

    constructor(props) {
        super(props);
        this.setQueueModalActiveTabId = this.setQueueModalActiveTabId.bind(this);
        this.generateHeadersPositions = this.generateHeadersPositions.bind(this);
        this.listScroll = this.listScroll.bind(this);
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
    componentDidMount() {
        this.refs.list.addEventListener('scroll', this.listScroll);
        this.listScroll();
    }
    componentWillUnmount(){
        this.refs.list.removeEventListener('scroll', this.listScroll);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.otaPlusMode) {
            this.bottomBorderColor = '#fa9872';
        } else {
            this.bottomBorderColor = '#9ce2d8';
        }
    }
    generateHeadersPositions() {
        const headers = this.activeTabId === 0
            ? this.refs.list.querySelectorAll('.tuf-list .section-header')
            : this.refs.list.querySelectorAll('.legacy-list .section-header');
        const wrapperPosition = this.refs.list.getBoundingClientRect();
        let positions = [];
        _.each(headers, (header) => {
            let position = header.getBoundingClientRect().top - wrapperPosition.top + this.refs.list.scrollTop;
            positions.push(position);
        }, this);
        return positions;
    }

    listScroll() {
        const headers = this.activeTabId === 0
            ? this.refs.list.querySelectorAll('.tuf-list .section-header')
            : this.refs.list.querySelectorAll('.legacy-list .section-header');
        if(this.refs.list) {
            const headersPositions = this.generateHeadersPositions();
            let scrollTop = this.refs.list.scrollTop;
            let newFakeHeaderLetter = this.fakeHeaderLetter;
            _.each(headersPositions, (position, index) => {
                if(scrollTop >= position) {
                    newFakeHeaderLetter = headers[index].innerHTML;
                    return true;
                } else if(scrollTop >= position - headerHeight) {
                    scrollTop -= scrollTop - (position - headerHeight);
                    return true;
                }
            }, this);
            this.fakeHeaderLetter = newFakeHeaderLetter;
            this.fakeHeaderTopPosition = scrollTop;
        }
    }
    setQueueModalActiveTabId(value) {
        this.fakeHeaderLetter = '';
        this.activeTabId = value;
    }
    render() {
        const { campaignsStore, groupsStore, showRenameModal, addNewWizard, highlightedCampaign, showCancelCampaignModal, showCancelGroupModal, showDependenciesModal } = this.props;
        const noTabs = !campaignsStore.preparedCampaigns.length || !campaignsStore.preparedLegacyCampaigns.length;
        return (
            <span>
                <CampaignsHeader
                    addNewWizard={addNewWizard}
                />
                <span className={`content-container ${noTabs ? '' : 'padding-top'}`} ref="list">
                    <Tabs
                        tabItemContainerStyle={{backgroundColor: 'transparent'}}
                        className="campaign-tabs"
                        inkBarStyle={{display: 'none'}}
                        onChange={this.setQueueModalActiveTabId}
                        tabItemContainerStyle={{borderBottom: noTabs ? 'none' : '5px solid ' + this.bottomBorderColor, backgroundColor: 'transparent'}}
                        contentContainerClassName={'campaigns-wrapper'}
                        tabTemplateStyle={{height: '100%'}}
                    >
                        {campaignsStore.preparedCampaigns.length ?
                            <Tab
                                label="Multi-targets campaigns"
                                className={`${noTabs ? 'hide' : ''} tab-item` + (this.activeTabId === 0 ? " active" : "")}
                                id="multi-target-campaigns"
                                value={0}
                            >
                                {this.fakeHeaderLetter.length ?
                                    <div className="fake-header" style={{top: this.fakeHeaderTopPosition}}>
                                        {this.fakeHeaderLetter}
                                    </div>
                                    : ''
                                }
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
                                className={`${noTabs ? 'hide' : ''} tab-item` + (this.activeTabId === 1 ? " active" : "")}
                                id="single-package-campaigns"
                                value={1}
                            >
                                {this.fakeHeaderLetter.length ?
                                    <div className="fake-header" style={{top: this.fakeHeaderTopPosition}}>
                                        {this.fakeHeaderLetter}
                                    </div>
                                    : ''
                                }
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