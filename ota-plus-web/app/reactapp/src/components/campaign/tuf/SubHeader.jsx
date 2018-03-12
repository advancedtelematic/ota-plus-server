import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { AsyncStatusCallbackHandler } from '../../../utils';

@observer
class SubHeader extends Component {
    @observable renameDisabled = true;
    @observable oldCampaignName = '';
    @observable newCampaignName = '';
    @observable newCampaignNameLength = 0;

    constructor(props) {
        super(props);
        this.enableCampaignRename = this.enableCampaignRename.bind(this);
        this.cancelCampaignRename = this.cancelCampaignRename.bind(this);
        this.renameCampaign = this.renameCampaign.bind(this);
        this.focusTextInput = this.focusTextInput.bind(this);
        this.userTypesName = this.userTypesName.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
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
    enableCampaignRename(e) {
        if(this.renameDisabled) {
            this.renameDisabled = false;
            this.focusTextInput();
            e.target.classList.add('hide');
        }
    }
    cancelCampaignRename() {
        this.renameDisabled = true; 
        this.newCampaignName = this.oldCampaignName;
        this.newCampaignNameLength = this.oldCampaignName.length;
        this.focusTextInput();
        this.clickableArea.classList.remove('hide');
    }
    userTypesName(e) {
        this.newCampaignName = e.target.value;
        this.newCampaignNameLength = e.target.value.length;
    }
    keyPressed(e) {
        if(e.key === 'Enter') {
            this.renameCampaign();
        }
    }
    renameCampaign() {
        const { campaign } = this.props.campaignsStore;
        this.clickableArea.classList.remove('hide');
        this.props.campaignsStore.renameCampaign(campaign.id, { name: this.newCampaignName }).then(() => {
            this.renameDisabled = true;
            this.oldCampaignName = this.newCampaignName;
            this.focusTextInput();
        });
    }
    focusTextInput() {
        if (this.renameDisabled) {
            this.campaignNameInput.setAttribute('disabled','true');
        } else {
            this.campaignNameInput.removeAttribute('disabled');
            this.campaignNameInput.focus();
        }
    }
    render() {
        const { title } = this.props;
        return (
            <div className="campaign-name">
                <div className="rename-container">
                    <div onClick={this.enableCampaignRename}
                         ref={(clickableArea) => {this.clickableArea = clickableArea}}
                         className="clickable-area"
                         style={{width: '100%', height: '100%', position: 'absolute'}} />

                     <input type="text"
                       ref={(input) => {this.campaignNameInput = input}}
                       disabled
                       onKeyPress={this.keyPressed}
                       value={this.newCampaignName} onChange={this.userTypesName} />

                    {this.renameDisabled ?
                        <img src="/assets/img/icons/black/edit.svg" className="edit" alt="Icon" style={{cursor: 'auto'}} />
                    :
                        <div className="icons">
                            {this.newCampaignNameLength ?
                                <img src="/assets/img/icons/accept_icon.png" className="rename" alt="Icon" onClick={this.renameCampaign} />
                            :
                                null
                            }
                            <img src="/assets/img/icons/close_icon.png" alt="Icon" className="cancel" onClick={this.cancelCampaignRename} />
                        </div>
                    }
                </div>
                <i className="fa fa-angle-up"></i>
            </div>
        );
    }
}

SubHeader.propTypes = {
}

export default SubHeader;