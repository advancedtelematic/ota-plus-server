import React, { Component, PropTypes } from 'react';

class QuotePlan extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div id="billing-plans-quote" className="billing-plans">
                <div className="billing-plan billing-plan-premium">
                    <div className="billing-plan-header">Premium</div>
                    <div className="billing-plan-body">
                        <div className="text-center">
                            <img src="/assets/img/icons/crown.png" style={{width: 120}} alt=""/><br /><br /><br />
                            Request received<br /><br />

                            Thank you for your interest in a <strong>PREMIUM</strong> <br />
                            subscription. We will be in touch shortly with <br />
                            a quote/purchase order to sign.
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default QuotePlan;