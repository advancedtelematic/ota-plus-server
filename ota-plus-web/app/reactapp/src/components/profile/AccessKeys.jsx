import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Loader } from '../../partials';
import { MetaData } from '../../utils';
import { ProvisioningContainer } from '../../containers';

const title = "Access keys";

@inject("stores")
@observer
class AccessKeys extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        const { provisioningStore } = this.props.stores; 
        provisioningStore.fetchProvisioningStatus();
    }
    componentWillUnmount() {
        const { provisioningStore } = this.props.stores; 
        provisioningStore._reset();
    }
    render() {
        return (
            <div className="profile-container" id="provisioning">
                <MetaData 
                    title={title}>
                    <ProvisioningContainer />
                </MetaData>
            </div>
        );
    }
}

export default AccessKeys;