import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../../utils';
import { FleetContainer } from '../../containers/otaplus';

const title = "Fleet";

@observer
class Fleet extends Component {
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
                        <FleetContainer />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

export default Fleet;