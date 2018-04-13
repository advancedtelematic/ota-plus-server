import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../../utils';
import { GatewayContainer } from '../../containers/otaplus';
import { Header } from '../../partials';

const title = "Gateway";

@observer
class Gateway extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <FadeAnimation>
                <Header 
                    title={title}
                    backButtonShown={true}
                />
	            <MetaData 
                    title={title}>
                    <GatewayContainer />
                </MetaData>
            </FadeAnimation>
        );
    }
}

export default Gateway;