import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../../utils';
import { FeaturesContainer } from '../../containers/otaplus';

const title = "Features";

@observer
class Features extends Component {
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
                        <FeaturesContainer />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

export default Features;