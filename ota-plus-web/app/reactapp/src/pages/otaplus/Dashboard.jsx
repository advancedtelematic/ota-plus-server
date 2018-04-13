import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../../utils';
import { DashboardContainer } from '../../containers/otaplus';
import { Header } from '../../partials';

const title = "Home";

@observer
class Dashboard extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <FadeAnimation>
                <Header
                    title={title}
                />
                <MetaData 
                    title={title}>
                    <DashboardContainer />
                </MetaData>
            </FadeAnimation>
        );
    }
}

export default Dashboard;