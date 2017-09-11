import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../../../utils';
import { LoginStep1Container } from '../../../containers/otaplus/login';

const title = "Login Step 1";

@observer
class Step1 extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { userStore } = this.props;
        return (
            <FadeAnimation
                display="flex">
                <div className="wrapper-center">
    	           <MetaData 
                        title={title}>
                        <LoginStep1Container
                            userStore={userStore}
                        />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

export default Step1;