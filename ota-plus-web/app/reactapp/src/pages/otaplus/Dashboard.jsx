import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../../utils';
import { DashboardContainer } from '../../containers/otaplus';

const title = "Dashboard";

@observer
class Dashboard extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <FadeAnimation
                display="flex">
                <div className="wrapper-center">
                    <MetaData 
                        title={title}>
                        <DashboardContainer />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

export default Dashboard;