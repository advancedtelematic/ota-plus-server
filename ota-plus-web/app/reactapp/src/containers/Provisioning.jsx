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

@observer
class Provisioning extends Component {
    @observable tooltipShown = false;
    @observable createModalShown = false;

    constructor(props) {
        super(props);
        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
        this.showCreateModal = this.showCreateModal.bind(this);
        this.hideCreateModal = this.hideCreateModal.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
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
    changeFilter(filter) {
        this.props.provisioningStore._filterProvisioningKeys(filter);
    }
    render() {
        const { provisioningStore } = this.props;
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
                                provisioningFilter={provisioningStore.provisioningFilter}
                                changeFilter={this.changeFilter}
                            />
                            <ProvisioningList 
                                provisioningStore={provisioningStore}
                                showTooltip={this.showTooltip}
                            />
                            <ProvisioningFooter 
                                provisioningStore={provisioningStore}
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
            </span>
        );
    }
}

Provisioning.propTypes = {
    provisioningStore: PropTypes.object
}

export default Provisioning;