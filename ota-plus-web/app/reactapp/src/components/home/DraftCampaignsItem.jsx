import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';

@observer
class DraftCampaignsItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { campaign } = this.props;
        return (
            <a
                href="#"
                className="element-box campaign" 
                title={campaign.name}
                id={"link-campaignwizard-" + campaign.id}
                >
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
    campaign: PropTypes.object.isRequired
}

export default DraftCampaignsItem;