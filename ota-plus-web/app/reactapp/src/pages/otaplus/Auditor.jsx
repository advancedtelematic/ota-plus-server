import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../../utils';
import { AuditorContainer } from '../../containers/otaplus';

const title = "Auditor";

@observer
class Auditor extends Component {
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
                        <AuditorContainer />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

export default Auditor;