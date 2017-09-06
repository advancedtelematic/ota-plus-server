import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../../utils';
import { SoftwareRepositoryContainer } from '../../containers/otaplus';

const title = "Software repository";

@observer
class SoftwareRepository extends Component {
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
                        <SoftwareRepositoryContainer />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

export default SoftwareRepository;