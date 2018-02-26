import React, { PropTypes, Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { CampaignsTufList } from './tuf';
import CampaignsHeader from './Header';
import { Tabs, Tab } from 'material-ui/Tabs';
import _ from 'underscore';

const headerHeight = 28;

@observer
class List extends Component {
    @observable fakeHeaderLetter = '';
    @observable fakeHeaderTopPosition = 0;

    constructor(props) {
        super(props);
        this.generateHeadersPositions = this.generateHeadersPositions.bind(this);
        this.listScroll = this.listScroll.bind(this);
    }
    componentDidMount() {
        this.refs.list.addEventListener('scroll', this.listScroll);
        this.listScroll();
    }
    componentWillUnmount(){
        this.refs.list.removeEventListener('scroll', this.listScroll);
    }
    generateHeadersPositions() {
        const headers = this.refs.list.querySelectorAll('.tuf-list .section-header');
        const wrapperPosition = this.refs.list.getBoundingClientRect();
        let positions = [];
        _.each(headers, (header) => {
            let position = header.getBoundingClientRect().top - wrapperPosition.top + this.refs.list.scrollTop;
            positions.push(position);
        }, this);
        return positions;
    }

    listScroll() {
        const headers = this.refs.list.querySelectorAll('.tuf-list .section-header');
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
    render() {
        const { campaignsStore, groupsStore, addNewWizard, highlightedCampaign, showCancelCampaignModal, showCancelGroupModal, showDependenciesModal, expandedCampaignName, toggleCampaign } = this.props;
        return (
            <span>
                <CampaignsHeader
                    addNewWizard={addNewWizard}
                />
                <span className="content-container" ref="list">
                    {campaignsStore.preparedCampaigns.length ?
                        <span>
                            {this.fakeHeaderLetter.length ?
                                <div className="fake-header" style={{top: this.fakeHeaderTopPosition}}>
                                    {this.fakeHeaderLetter}
                                </div>
                            :
                                null
                            }
                            <div className="wrapper-list">
                                <CampaignsTufList
                                    campaignsStore={campaignsStore}
                                    groupsStore={groupsStore}
                                    highlightedCampaign={highlightedCampaign}
                                    showCancelCampaignModal={showCancelCampaignModal}
                                    showDependenciesModal={showDependenciesModal}
                                    expandedCampaignName={expandedCampaignName}
                                    toggleCampaign={toggleCampaign}
                                />
                            </div>
                        </span>
                    :
                        null
                    }
                </span>
            </span>
        );
    }
}

List.propTypes = {    
}

export default List;