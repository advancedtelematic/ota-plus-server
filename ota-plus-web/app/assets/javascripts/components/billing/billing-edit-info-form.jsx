define(function(require) {
  var React = require('react');
      
  class BillingEditInfoForm extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      const { billingInfo } = this.props;
      return (
        <div>      
          <div className="row">
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="input-company-name">Company name</label>
                <input type="text" className="form-control" name="company" id="input-company-name" defaultValue={billingInfo.company} required/>
              </div>
            </div>
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="input-Email">Email</label>
                <input type="text" className="form-control" name="email" id="input-Email" defaultValue={billingInfo.email} required/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="input-first-name">First name</label>
                <input type="text" className="form-control" name="firstname" id="input-first-name" defaultValue={billingInfo.firstname} required/>
              </div>
            </div>
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="input-last-name">Last name</label>
                <input type="text" className="form-control" name="lastname" id="input-last-name" defaultValue={billingInfo.lastname} required/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="input-address">Address</label>
                <input type="text" className="form-control" name="address" id="input-address" defaultValue={billingInfo.address} required/>
              </div>
            </div>
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="input-city">City</label>
                <input type="text" className="form-control" name="city" id="input-city" defaultValue={billingInfo.city} required/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="input-postal-code">Postal code</label>
                <input type="text" className="form-control" name="postal_code" id="input-postal-code" defaultValue={billingInfo.postal_code} required/>
              </div>
            </div>
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="input-country">Country</label>
                <input type="text" className="form-control" name="country" id="input-country" defaultValue={billingInfo.country} required/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="input-vat-number">Intracom VAT number</label>
                <input type="text" className="form-control" name="vat_number" id="input-vat-number" defaultValue={billingInfo.vat_number} required/>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  BillingEditInfoForm.propTypes = {
    billingInfo: React.PropTypes.object.isRequired
  };

  return BillingEditInfoForm;
});
