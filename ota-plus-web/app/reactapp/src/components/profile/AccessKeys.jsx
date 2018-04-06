import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader } from '../../partials';
import { MetaData } from '../../utils';
import { ProvisioningContainer } from '../../containers';

const title = "Access keys";

@observer
class AccessKeys extends Component {
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
        const { provisioningStore, devicesStore } = this.props;
        return (
            <div className="profile-container" id="provisioning">
                <MetaData 
                    title={title}>
                    <ProvisioningContainer
                        provisioningStore={provisioningStore}
                        devicesStore={devicesStore}
                    />
                </MetaData>
            </div>
        );
    }
}

export default AccessKeys;