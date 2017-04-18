import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';

@observer
class DraftCampaignsItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { campaign, showWizard } = this.props;
        return (
            <a
                href="#"
                className="element-box campaign" 
                title={campaign.name}
                id={"link-campaignwizard-" + campaign.id}
                onClick={showWizard.bind(this, campaign.id)}>
                <div className="icon"></div>
                <div className="desc">
                    <div className="title">
                        {campaign.name}
                    </div>
                    <div className="subtitle">
                        Start date: none
                    </div>
                    <div className="subtitle">
                        End date: none
                    </div>
                </div>
            </a>
        );
    }
}

DraftCampaignsItem.propTypes = {
    campaign: PropTypes.object.isRequired,
    showWizard: PropTypes.func.isRequired
}

export default DraftCampaignsItem;