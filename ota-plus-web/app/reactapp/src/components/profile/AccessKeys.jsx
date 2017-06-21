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
        const { provisioningStore, devicesStore, groupsStore } = this.props;
        return (
            <main id="access-keys">
                <div className="title top">
                    <img src="/assets/img/icons/black/key.png" alt=""/>
                    Provisioning keys
                </div>
                <div className={"wrapper-flex" + (!provisioningStore.preparedProvisioningKeys.length ? " whitened" : "")}>
                    <MetaData 
                        title={title}>
                        <ProvisioningContainer
                            provisioningStore={provisioningStore}
                            devicesStore={devicesStore}
                            groupsStore={groupsStore}
                        />
                    </MetaData>
                </div>
            </main>
        );
    }
}

AccessKeys.propTypes = {
    provisioningStore: PropTypes.object,
    devicesStore: PropTypes.object,
    groupsStore: PropTypes.object
}

export default AccessKeys;