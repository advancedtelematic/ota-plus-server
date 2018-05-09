import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';

const title = "Profile";

@observer
class TermsAndConditions extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {  } = this.props;
        return (
            <FadeAnimation>
                <MetaData title={title}>
                    <div className="header">
                        General terms and conditions
                    </div>
                    <div className="wrapper">
                        <div className="content-header">
                            <span className="border">Privacy Policy</span>
                            <span>Effective date: <span className="date">Friday, 4 December, 2015</span></span>
                        </div>
                        <div className="content">
                            <h2>We care about your privacy</h2>
                            <p>
                                (1) HERE Technologies (hereinafter also “ATS”) provides its customers (hereinafter also “customer”) with “ATS Garage”
                                software as a service (hereinafter also “ATS Garage”, “the service, “the software”), a cloud-based over-the-air software and
                                firmware update management system. "HERE" refers to either (i) HERE Europe B.V. with offices at Kennedyplein 222-226, 5611 ZT Eindhoven,
                                The Netherlands, if your official address is in any country within Europe, Russia, the Middle East or Africa, or (ii) HERE North America,
                                LLC with offices at 425 West Randolph Street, 60606 Chicago, Illinois, USA, if your official address is in any other country.
                            </p>
                            <p>
                                (2) These General Terms and Conditions apply to and are part of the contract on the use of “ATS Garage” (hereinafter: “ATS Garage” contract or “the contract”).
                            </p>
                            <p>
                                (3) These General Terms and Conditions shall apply exclusively. Contractual provisions of the customer shall not be applicable. Counter-claims by the
                                customer with reference to his own Terms and Conditions are expressly rejected.
                            </p>
                            <p>
                                (4) The requirement of a written form under these Terms and Conditions is observed by telefax or e-mail.
                            </p>
                        </div>
                    </div>
                </MetaData>
            </FadeAnimation>
        );
    }
}

export default TermsAndConditions;