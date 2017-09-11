import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../../../utils';
import { LoginStep2Container } from '../../../containers/otaplus/login';

const title = "Login Step 2";

@observer
class Step2 extends Component {
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
                        <LoginStep2Container />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

export default Step2;