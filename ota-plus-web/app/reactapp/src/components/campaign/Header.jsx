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
        this.focusTextInput();
    }
    userTypesName(e) {
        this.newCampaignName = e.target.value;
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
                             <input type="text"
                               ref={(input) => {this.campaignNameInput = input}}
                               size={this.newCampaignName.length + 5}
                               maxLength={100}
                               disabled
                               onKeyPress={this.keyPressed}
                               value={this.newCampaignName} onChange={this.userTypesName} />
                            {this.renameDisabled ?
                                <i className="fa fa-pencil" aria-hidden="true" onClick={this.enableCampaignRename} />
                            :
                                <div className="icons">
                                    <i className="fa fa-check-square" aria-hidden="true" onClick={this.renameCampaign} />
                                    <i className="fa fa-window-close" aria-hidden="true" onClick={this.cancelCampaignRename} />
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