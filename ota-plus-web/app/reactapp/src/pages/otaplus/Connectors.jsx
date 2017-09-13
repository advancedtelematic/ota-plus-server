import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../../utils';
import { ConnectorsContainer } from '../../containers/otaplus';
import { Header } from '../../partials';

const title = "Connectors";

@observer
class Connectors extends Component {
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
                        <ConnectorsContainer />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

export default Connectors;