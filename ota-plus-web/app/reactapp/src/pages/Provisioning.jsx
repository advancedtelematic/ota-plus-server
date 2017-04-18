import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { Header } from '../partials';
import { ProvisioningContainer } from '../containers';

const title = "Provisioning";

@observer
class Provisioning extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        this.props.provisioningStore.fetchProvisioningStatus();
    }
    componentWillUnmount() {
        this.props.provisioningStore._reset();
    }
    render() {
        const { provisioningStore } = this.props;
        return (
            <FadeAnimation 
                display="flex">
                <div className="wrapper-flex">
                    <Header 
                        title={title}
                    />
                    <MetaData 
                        title={title}>
                        <ProvisioningContainer 
                            provisioningStore={provisioningStore}
                        />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

Provisioning.propTypes = {
    provisioningStore: PropTypes.object
}

export default Provisioning;