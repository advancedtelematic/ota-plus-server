define(function(require) {
  var React = require('react'),
      serializeForm = require('mixins/serialize-form'),
      SotaDispatcher = require('sota-dispatcher'),
      BillingEditInfoForm = require('./billing-edit-info-form'),
      Responses = require('../responses');

  class BillingEditInfoModal extends React.Component {
    constructor(props) {
      super(props);
    }
    handleSubmit(e) {
      e.preventDefault();
      var data = serializeForm(this.refs.form);
      data.plan = 'quote';
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
                    successText="We have received your plan upgrade request." 
                    errorText="Error occured during plan upgrading."/>
                  <BillingEditInfoForm 
                    billingInfo={this.props.billingInfo}/>
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

  BillingEditInfoModal.propTypes = {
    closeModal: React.PropTypes.func.isRequired,
    billingInfo: React.PropTypes.object.isRequired
  };

  return BillingEditInfoModal;
});
