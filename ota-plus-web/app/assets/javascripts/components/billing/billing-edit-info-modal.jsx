define(function(require) {
  var React = require('react'),
      serializeForm = require('mixins/serialize-form'),
      SotaDispatcher = require('sota-dispatcher'),
      Responses = require('../responses');

  class BillingEditInfoModal extends React.Component {
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
        <div id="modal-billing-edit-info" className="myModal" role="dialog">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Fill billing information</h4>
              </div>
              <form ref='form' onSubmit={this.handleSubmit.bind(this)}>
                <div className="modal-body">
                  <Responses 
                    action="update-user-billing" 
                    successText="Profile has been updated." 
                    errorText="Error occured during profile update."/>
                  <div className="row">
                    <div className="col-xs-6">
                      <div className="form-group">
                        <label htmlFor="input-company-name">Company name</label>
                        <input type="text" className="form-control" name="company" id="input-company-name" required/>
                      </div>
                    </div>
                    <div className="col-xs-6">
                      <div className="form-group">
                        <label htmlFor="input-Email">Email</label>
                        <input type="text" className="form-control" name="email" id="input-Email" required/>
                      </div>
                    </div>
                  </div>
                  <div className="row">
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
                  <div className="row">
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
                  <div className="row">
                    <div className="col-xs-6">
                      <div className="form-group">
                        <label htmlFor="input-postal-code">Postal code</label>
                        <input type="text" className="form-control" name="postal_code" id="input-postal-code" required/>
                      </div>
                    </div>
                    <div className="col-xs-6">
                      <div className="form-group">
                        <label htmlFor="input-country">Country</label>
                        <input type="text" className="form-control" name="country" id="input-country" required/>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-6">
                      <div className="form-group">
                        <label htmlFor="input-vat-number">Intracom VAT number</label>
                        <input type="text" className="form-control" name="vat_number" id="input-vat-number" required/>
                      </div>
                    </div>
                  </div>
                </div> 
                <div className="modal-footer">
                  <a href="#" onClick={this.props.closeModal} className="darkgrey margin-top-20 pull-left">Cancel</a>
                  <button type="submit" className="btn btn-confirm pull-right">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
  };

  return BillingEditInfoModal;
});
