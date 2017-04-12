import React, { Component, PropTypes } from 'react';
import { FlatButton } from 'material-ui';

class FreePlan extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { showInfoModal } = this.props;
        return (
            <div className="billing-plans">
                <div className="billing-plan">
                    <div className="billing-plan-header">Current</div>
                    <div className="billing-plan-body">
                        <ul className="billing-features">
                            <li>20 devices</li>
                            <li>Community support only</li>
                        </ul>
                        <div className="billing-price">
                            0 €
                        </div>
                        <hr />
                        <div className="text-center">
                            The <strong>BASIC</strong> account allows <br />
                            up to 20 active devices, with<br />
                            community support only.
                        </div>
                    </div>
                </div>
                <div className="billing-plan billing-plan-premium">
                    <div className="billing-plan-header">Premium</div>
                    <div className="billing-plan-body">
                        <ul className="billing-features">
                            <li>Unlimited devices</li>
                            <li>Premium support</li>
                        </ul>
                        <div className="billing-price">
                            0.99 €
                        </div>
                        <hr />
                        <div className="billing-subdesc">
                            per device (after the first 20 devices)
                        </div>
                        <div className="text-center">
                            <FlatButton
                                label="Upgrade"
                                type="button"
                                className="btn-main"
                                onClick={showInfoModal}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FreePlan;