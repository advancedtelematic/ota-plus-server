import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../../utils';
import { DeviceRegistryContainer } from '../../containers/otaplus';
import { Header } from '../../partials';

const title = "Device registry";

@observer
class DeviceRegistry extends Component {
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
                        <DeviceRegistryContainer />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

export default DeviceRegistry;