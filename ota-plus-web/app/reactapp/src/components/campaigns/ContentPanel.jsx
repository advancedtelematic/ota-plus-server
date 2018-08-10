import React, { PropTypes, Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import List from './List';
import { Tabs, Tab } from 'material-ui/Tabs';
import _ from 'underscore';
import ReactDOM from 'react-dom';

const headerHeight = 28;

@inject("stores")
@observer
class ContentPanel extends Component {
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
        const headers = this.refs.list.querySelectorAll('.section-header');
        const wrapperPosition = this.refs.list.getBoundingClientRect();
        let positions = [];
        _.each(headers, (header) => {
            let position = header.getBoundingClientRect().top - wrapperPosition.top + this.refs.list.scrollTop;
            positions.push(position);
        }, this);
        return positions;
    }

    listScroll() {
        const headers = this.refs.list.querySelectorAll('.section-header');
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
        const { highlightedCampaign, showCancelCampaignModal, showDependenciesModal, expandedCampaignName, toggleCampaign, addNewWizard } = this.props;
        const { campaignsStore } = this.props.stores;
        return (
            <div className="campaigns" ref="list">
                {campaignsStore.preparedCampaigns.length ?
                    <span>
                        <div className="campaigns__fake-header-link" style={{top: this.fakeHeaderTopPosition + 10}}>
                            <a href="#" className="add-button grey-button" id="add-new-campaign" onClick={(e) => { e.preventDefault(); addNewWizard() }} >
                                <span>
                                    +
                                </span>
                                <span>
                                    Add campaign
                                </span>
                            </a>
                        </div>
                        {this.fakeHeaderLetter.length ?
                            <div className="campaigns__fake-header" style={{top: this.fakeHeaderTopPosition}} dangerouslySetInnerHTML={{__html: this.fakeHeaderLetter}}>
                            </div>
                        :
                            null
                        }
                        <List
                            highlightedCampaign={highlightedCampaign}
                            showCancelCampaignModal={showCancelCampaignModal}
                            showDependenciesModal={showDependenciesModal}
                            expandedCampaignName={expandedCampaignName}
                            toggleCampaign={toggleCampaign}
                        />
                    </span>
                :
                    null
                }
            </div>
        );
    }
}

ContentPanel.propTypes = {
    stores: PropTypes.object
}

export default ContentPanel;