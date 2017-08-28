import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader } from '../../partials';
import { 
    BillingFreePlan, 
    BillingQuotePlan, 
    BillingPremiumPlan, 
    BillingInfoModal 
} from './billing';
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
            <main id="billing">
                <div className="title">
                    <img src="/assets/img/icons/black/billing.png" alt=""/>
                    Billing
                </div>

                <hr />

                {!userStore.user.fullName && userStore.userFetchAsync.isFetching ? 
                    <div className="wrapper-center">
                        <Loader 
                            className="dark"
                        />
                    </div>
                :
                    <div className="billing-container">
                        {userStore.user.profile.plan == "premium" ? 
                            <div className="premium">
                                <BillingPremiumPlan 
                                    userStore={userStore}
                                />
                            </div>
                        : 
                            userStore.user.profile.plan == "quote" ?
                                <div className="quote">
                                    <BillingQuotePlan />
                                </div>
                            :
                                <div className="free">
                                    <BillingFreePlan 
                                        showInfoModal={this.showInfoModal}
                                    />
                                </div>
                            }
                    </div>
                }
                <BillingInfoModal 
                    shown={this.infoModalShown}
                    hide={this.hideInfoModal}
                    userStore={userStore}
                />
            </main>
        );
    }
}

Billing.propTypes = {
    userStore: PropTypes.object
};

export default Billing;