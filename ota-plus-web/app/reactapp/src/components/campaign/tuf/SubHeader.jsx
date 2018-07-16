import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import {Dropdown, EditCampaignModal} from '../../../partials';
import { AsyncStatusCallbackHandler } from '../../../utils';

@observer
class SubHeader extends Component {
    @observable renameDisabled = true;
    @observable newCampaignNameLength = 0;
    @observable submenuIsShown = false;
    @observable editModal = false;

    constructor(props) {
        super(props);
        this.showSubmenu = this.showSubmenu.bind(this);
        this.hideSubmenu = this.hideSubmenu.bind(this);
        this.showEditModal = this.showEditModal.bind(this);
        this.hideEditModal = this.hideEditModal.bind(this);
    }
    componentWillMount() {
        this.oldCampaignName = this.props.title;
        this.newCampaignName = this.props.title;
        this.newCampaignNameLength = this.props.title.length;
    }
    componentWillReceiveProps(nextProps) {
        if(!_.isEmpty(nextProps.title)) {
            this.oldCampaignName = nextProps.title;
            this.newCampaignName = nextProps.title;
            this.newCampaignNameLength = nextProps.title.length;
        }
    }
    showEditModal(e) {
        e.preventDefault();
        this.editModal = true;
    }
    hideEditModal() {
        this.editModal = false;
    }
    hideSubmenu() {
        this.submenuIsShown = false;
    }
    showSubmenu() {
        this.submenuIsShown = true;
    }
    render() {
        const { campaignsStore, showCancelCampaignModal, hideCancel = true } = this.props;
        return (
            <div className="statistics__campaign-name">
                {this.newCampaignName}
                <div className="dots" onClick={this.showSubmenu}>
                    <span></span>
                    <span></span>
                    <span></span>

                    <Dropdown show={this.submenuIsShown} hideSubmenu={this.hideSubmenu} customStyles={{
                        width: '130px',
                        left: '-100px',
                        fontSize: '14px',
                        color: '#9B9DA2',
                        fontWeight: '400'
                    }}>
                        <li className="package-dropdown-item">
                            <i className="icon icon-edit"/>
                            <a className="package-dropdown-item" href="#" id="edit-comment"
                               onClick={this.showEditModal}
                            >
                                Edit
                            </a>
                        </li>
                        {campaignsStore.campaign.statistics.status === 'launched' || !hideCancel ?
                            <li className="package-dropdown-item">
                                <i className="icon icon-trash"/>
                                <a className="package-dropdown-item" href="#" id="campaign-detail-cancel-all"
                                   onClick={showCancelCampaignModal}
                                >
                                    Cancel campaign
                                </a>
                            </li>
                            :
                            null
                        }
                    </Dropdown>
                </div>
                {campaignsStore.campaign.statistics.status === 'launched' ?
                    <div className="cancel-campaign">
                        <button id="campaign-detail-cancel-all" className="delete-button fixed-width" onClick={showCancelCampaignModal}>
                            Cancel campaign
                        </button>
                    </div>
                :
                    null
                }
                <EditCampaignModal
                    modalTitle={(
                        <div className="title">
                            Edit name
                        </div>
                    )}
                    shown={this.editModal}
                    hide={this.hideEditModal}
                    campaignsStore={campaignsStore}
                    defaultValue={this.newCampaignName}
                />
            </div>
        );
    }
}

SubHeader.propTypes = {
}

export default SubHeader;