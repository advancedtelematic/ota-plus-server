import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { FormsyText } from 'formsy-material-ui/lib';

@observer
class InfoForm extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { billingInfo } = this.props;
        return (
            <div>      
                <div className="row">
                    <div className="col-xs-6">
                        <FormsyText
                            name="company"
                            value={billingInfo.company}
                            floatingLabelText="Company name"
                            className="input-wrapper"
                            updateImmediately
                            required
                        />
                    </div>
                    <div className="col-xs-6">
                        <FormsyText
                            name="email"
                            value={billingInfo.email}
                            floatingLabelText="Email"
                            className="input-wrapper"
                            updateImmediately
                            required
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6">
                        <FormsyText
                            name="firstname"
                            value={billingInfo.firstname}
                            floatingLabelText="First name"
                            className="input-wrapper"
                            updateImmediately
                            required
                        />
                    </div>
                    <div className="col-xs-6">
                        <FormsyText
                            name="lastname"
                            value={billingInfo.lastname}
                            floatingLabelText="Last name"
                            className="input-wrapper"
                            updateImmediately
                            required
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6">
                        <FormsyText
                            name="address"
                            value={billingInfo.address}
                            floatingLabelText="Address"
                            className="input-wrapper"
                            updateImmediately
                            required
                        />
                    </div>
                    <div className="col-xs-6">
                        <FormsyText
                            name="city"
                            value={billingInfo.city}
                            floatingLabelText="City"
                            className="input-wrapper"
                            updateImmediately
                            required
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6">
                        <FormsyText
                            name="postal_code"
                            value={billingInfo.postal_code}
                            floatingLabelText="Postal code"
                            className="input-wrapper"
                            updateImmediately
                            required
                        />
                    </div>
                    <div className="col-xs-6">
                        <FormsyText
                            name="country"
                            value={billingInfo.country}
                            floatingLabelText="Country"
                            className="input-wrapper"
                            updateImmediately
                            required
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6">
                        <FormsyText
                            name="vat_number"
                            value={billingInfo.vat_number}
                            floatingLabelText="Intracom VAT number"
                            className="input-wrapper"
                            updateImmediately
                            required
                        />
                    </div>
                </div>
            </div>
        );
    }
}

InfoForm.propTypes = {
    billingInfo: PropTypes.object.isRequired
}

export default InfoForm;