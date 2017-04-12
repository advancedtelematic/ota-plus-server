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
} from '../components/provisioning';
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
        this.activateHandler = new AsyncStatusCallbackHandler(props.provisioningStore, 'provisioningActivateAsync', this.hideTooltip);
    }
    componentWillUnmount() {
        this.activateHandler();
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
                            />
                            <ProvisioningList 
                                provisioningStore={provisioningStore}
                            />
                            <ProvisioningFooter 
                                provisioningStore={provisioningStore}
                            />
                        </span>
                    :
                        <div className="wrapper-center">
                            <div className="page-intro">
                                <div>Provisioning not activated.</div>
                                <a href="#" onClick={this.showTooltip}>What is this?</a>
                            </div>
                        </div>
                }
                <ProvisioningTooltip 
                    shown={this.tooltipShown}
                    hide={this.hideTooltip}
                    provisioningStore={provisioningStore}
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