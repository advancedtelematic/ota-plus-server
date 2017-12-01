import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { AsyncStatusCallbackHandler } from '../../utils';

@observer
class Header extends Component {
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
        this.renameHandler = new AsyncStatusCallbackHandler(props.campaignsStore, 'campaignsRenameAsync', this.handleResponse.bind(this));
    }
    componentWillReceiveProps(nextProps) {
        if(!_.isEmpty(nextProps.title)) {
            this.oldCampaignName = nextProps.title;
            this.newCampaignName = nextProps.title;
            this.newCampaignNameLength = nextProps.title.length;
        }
    }
    componentWillUnmount() {
        this.renameHandler();
    }
    enableCampaignRename() {
        this.renameDisabled = false;
        this.focusTextInput();
    }
    cancelCampaignRename() {
        this.renameDisabled = true; 
        this.newCampaignName = this.oldCampaignName;
        this.newCampaignNameLength = this.oldCampaignName.length;
        this.focusTextInput();
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
        if(campaign.isLegacy) {
            this.props.campaignsStore.renameLegacyCampaign(campaign.meta.id, { name: this.newCampaignName });
        } else {
            this.props.campaignsStore.renameCampaign(campaign.id, { name: this.newCampaignName });
        }
    }
    handleResponse() {
        this.renameDisabled = true;
        this.oldCampaignName = this.newCampaignName;
        this.focusTextInput();
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
        const { title, subtitle, backButtonShown, backButtonAction, children } = this.props;
        return (
            <div className="page-heading">
                <div className="container">
                    {backButtonShown ? 
                        <a href="#" id="back-button" className="back-button" onClick={backButtonAction}>
                            <img src="/assets/img/icons/back.png" className="icon-back" alt="" />
                        </a>
                    : null}
                    <div className="icon"></div>
                    <div className="text">
                        <div className="title">
                            <div onClick={this.enableCampaignRename}
                                 className="clickable-area"
                                 style={{width: '85%', height: '51px', position: 'absolute'}}/>

                             <input type="text"
                               ref={(input) => {this.campaignNameInput = input}}
                               disabled
                               onKeyPress={this.keyPressed}
                               value={this.newCampaignName} onChange={this.userTypesName} />

                            {this.renameDisabled ?
                                <img src="/assets/img/icons/white/Rename.svg" className="edit" alt="Icon" onClick={this.enableCampaignRename} />
                            :
                                <div className="icons">
                                    {this.newCampaignNameLength ?
                                        <img src="/assets/img/icons/white/Tick.svg" className="rename" alt="Icon" onClick={this.renameCampaign} />
                                    :
                                        null
                                    }
                                    <img src="/assets/img/icons/white/X.svg" alt="Icon" className="cancel" onClick={this.cancelCampaignRename} />
                                </div>
                            }
                        </div>
                        {subtitle ?
                            <div className="subtitle">{subtitle}</div>
                        :
                            null
                        }
                    </div>
                    {children}
                </div>
            </div>
        );
    }
}

Header.propTypes = {
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.object,
    ]),
    subtitle: PropTypes.any,
    backButtonShown: PropTypes.bool,
    backButtonAction: PropTypes.func,
    children: PropTypes.object,
}

Header.defaultProps = {
    backButtonShown: false,
}

export default Header;