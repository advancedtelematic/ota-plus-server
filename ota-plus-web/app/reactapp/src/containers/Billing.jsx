import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader } from '../partials';
import { 
    BillingFreePlan, 
    BillingQuotePlan, 
    BillingPremiumPlan, 
    BillingInfoModal 
} from '../components/billing';

@observer
class Billing extends Component {
    @observable infoModalShown = false;

    constructor(props) {
        super(props);
        this.showInfoModal = this.showInfoModal.bind(this);
        this.hideInfoModal = this.hideInfoModal.bind(this);
    }
    showInfoModal(e) {
        if(e) e.preventDefault();
        this.infoModalShown = true;
    }
    hideInfoModal(e) {
        if(e) e.preventDefault();
        this.infoModalShown = false;
    }
    render() {
        const { userStore } = this.props;
        return (
            <span>
                {userStore.userFetchAsync.isFetching ? 
                    <div className="wrapper-center">
                        <Loader 
                            className="dark"
                        />
                    </div>
                :
                    userStore.user.profile.plan == "premium" ? 
                        <BillingPremiumPlan 
                            userStore={userStore}
                        />
                    : 
                        userStore.user.profile.plan == "quote" ?
                            <BillingQuotePlan />
                        :
                            <BillingFreePlan 
                                showInfoModal={this.showInfoModal}
                            />
                }
                <BillingInfoModal 
                    shown={this.infoModalShown}
                    hide={this.hideInfoModal}
                    userStore={userStore}
                />
            </span>
        );
    }
}

Billing.propTypes = {
    userStore: PropTypes.object.isRequired
}

export default Billing;