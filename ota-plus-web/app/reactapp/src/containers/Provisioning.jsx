import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader } from '../partials';
import { resetAsync } from '../utils/Common';
import { 
    ProvisioningTooltip, 
    ProvisioningHeader,
    ProvisioningList,
    ProvisioningFooter,
    ProvisioningCreateModal
} from '../components/profile/access-keys';
import { AsyncStatusCallbackHandler } from '../utils';
import { DevicesCreateModal } from '../components/devices';

@observer
class Provisioning extends Component {
    @observable tooltipShown = false;
    @observable createModalShown = false;
    @observable devicesCreateModalShown = false;

    constructor(props) {
        super(props);
        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
        this.showCreateModal = this.showCreateModal.bind(this);
        this.showDevicesCreateModal = this.showDevicesCreateModal.bind(this);
        this.hideCreateModal = this.hideCreateModal.bind(this);
        this.hideDevicesCreateModal = this.hideDevicesCreateModal.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.changeSort = this.changeSort.bind(this);
    }
    showTooltip(e) {
        if(e) e.preventDefault();
        this.tooltipShown = true;
    }
    hideTooltip(e) {
        if(e) e.preventDefault();
        this.tooltipShown = false;
    }
    showCreateModal(e) {
        if(e) e.preventDefault();
        this.createModalShown = true;
    }
    hideCreateModal(e) {
        if(e) e.preventDefault();
        this.createModalShown = false;
        resetAsync(this.props.provisioningStore.provisioningKeyCreateAsync);
    }
    showDevicesCreateModal(e) {
        if(e) e.preventDefault();
        this.devicesCreateModalShown = true;
    }
    hideDevicesCreateModal(e) {
        if(e) e.preventDefault();
        this.devicesCreateModalShown = false;
    }
    changeFilter(filter) {
        this.props.provisioningStore._filterProvisioningKeys(filter);
    }
    changeSort(sort, e) {
        if(e) e.preventDefault();
        this.props.provisioningStore._prepareProvisioningKeys(sort);
    }
    render() {
        const { provisioningStore, devicesStore, groupsStore, uiCredentialsDownload, prebuiltDebrpm } = this.props;
        return (
            <span>
                {provisioningStore.provisioningStatusFetchAsync.isFetching ?
                    <div className="wrapper-center">
                        <Loader />
                    </div>
                :
                    provisioningStore.provisioningStatus.active ? 
                        <span>
                            <ProvisioningHeader 
                                showCreateModal={this.showCreateModal}
                                showDevicesCreateModal={this.showDevicesCreateModal}
                                devicesFilter={devicesStore.devicesFilter}
                                changeFilter={this.changeFilter}
                                provisioningSort={provisioningStore.provisioningKeysSort}
                                changeSort={this.changeSort}
                            />
                            <ProvisioningList 
                                provisioningStore={provisioningStore}
                                showTooltip={this.showTooltip}
                            />
                            <ProvisioningFooter 
                                provisioningStore={provisioningStore}
                                showDevicesCreateModal={this.showDevicesCreateModal}
                                uiCredentialsDownload={uiCredentialsDownload}
                                prebuiltDebrpm={prebuiltDebrpm}
                            />
                        </span>
                    :
                        <div className="wrapper-center">
                            <div className="page-intro">
                                <div>Provisioning not activated.</div>
                            </div>
                        </div>
                }
                <ProvisioningTooltip 
                    shown={this.tooltipShown}
                    hide={this.hideTooltip}
                />
                <ProvisioningCreateModal 
                    shown={this.createModalShown}
                    hide={this.hideCreateModal}
                    provisioningStore={provisioningStore}
                />
                <DevicesCreateModal 
                    shown={this.devicesCreateModalShown}
                    hide={this.hideDevicesCreateModal}
                    devicesStore={devicesStore}
                    groupsStore={groupsStore}
                />
            </span>
        );
    }
}

Provisioning.propTypes = {
    provisioningStore: PropTypes.object
}

export default Provisioning;