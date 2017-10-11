import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../../utils';
import { AdvancedCampaignsContainer } from '../../containers/otaplus';
import { Header } from '../../partials';

const title = "Advanced campaigns";

@observer
class AdvancedCampaigns extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <FadeAnimation
                display="flex">
                <Header
                    title={title}
                />
                <div className="wrapper-center">
    	           <MetaData 
                        title={title}>
                        <AdvancedCampaignsContainer />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

export default AdvancedCampaigns;