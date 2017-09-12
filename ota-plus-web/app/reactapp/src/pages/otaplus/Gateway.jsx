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
            <FadeAnimation
                display="flex">
                <Header 
                    title={title}
                    backButtonShown={true}
                />
                <div className="wrapper-center">
    	           <MetaData 
                        title={title}>
                        <GatewayContainer />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

export default Gateway;