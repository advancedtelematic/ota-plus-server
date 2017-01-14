define(function(require) {
  var React = require('react'),
      serializeForm = require('mixins/serialize-form'),
      SotaDispatcher = require('sota-dispatcher'),
      Responses = require('../responses');

  class EditProfileBilling extends React.Component {
    constructor(props) {
      super(props);
    }
    handleSubmit(e) {
      e.preventDefault();
      var data = serializeForm(this.refs.form);
      SotaDispatcher.dispatch({
        actionType: 'update-user-billing',
        data: data
      });
    }
    render() {
      return (
        <div className="panel panel-grey">
          <div className="panel-heading">Billing information</div>
          <div className="panel-body">
            <div className="col-xs-12">
              <Responses 
               action="update-user-billing" 
               successText="Profile has been updated." 
               errorText="Error occured during profile update."/>
            </div>
            <form ref="form" onSubmit={this.handleSubmit.bind(this)} id="form-billing-information">
              <div>
                <div className="col-xs-6">
                  <div className="form-group">
                    <label htmlFor="input-company-name">Company name</label>
                    <input type="text" className="form-control" name="company" id="input-company-name" required/>
                  </div>
                </div>
                <div className="col-xs-6">
                  <div className="form-group">
                    <label htmlFor="input-Email">Email</label>
                    <input type="text" className="form-control" name="Email" id="input-Email" required/>
                  </div>
                </div>
              </div>
              <div>
                <div className="col-xs-6">
                  <div className="form-group">
                    <label htmlFor="input-first-name">First name</label>
                    <input type="text" className="form-control" name="firstname" id="input-first-name" required/>
                  </div>
                </div>
                <div className="col-xs-6">
                  <div className="form-group">
                    <label htmlFor="input-last-name">Last name</label>
                    <input type="text" className="form-control" name="lastname" id="input-last-name" required/>
                  </div>
                </div>
              </div>
              <div>
                <div className="col-xs-6">
                  <div className="form-group">
                    <label htmlFor="input-address">Address</label>
                    <input type="text" className="form-control" name="address" id="input-address" required/>
                  </div>
                </div>
                <div className="col-xs-6">
                  <div className="form-group">
                    <label htmlFor="input-city">City</label>
                    <input type="text" className="form-control" name="city" id="input-city" required/>
                  </div>
                </div>
              </div>
              <div>
                <div className="col-xs-6">
                  <div className="form-group">
                    <label htmlFor="input-postal-code">Postal code</label>
                    <input type="text" className="form-control" name="postalCode" id="input-postal-code" required/>
                  </div>
                </div>
                <div className="col-xs-6">
                  <div className="form-group">
                    <label htmlFor="input-country">Country</label>
                    <input type="text" className="form-control" name="country" id="input-country" required/>
                  </div>
                </div>
              </div>
              <div>
                <div className="col-xs-6">
                  <div className="form-group">
                    <label htmlFor="input-vat-number">Intracom VAT number</label>
                    <input type="text" className="form-control" name="vat_number" id="input-vat-number" required/>
                  </div>
                </div>
              </div>
              <div className="col-xs-12">
                <button type="submit" className="btn btn-confirm pull-right">Update details</button>
              </div>
            </form>
          </div>
        </div>
      );
    }
  };

  return EditProfileBilling;
});
