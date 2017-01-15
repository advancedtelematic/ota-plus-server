define(function(require) {
  var React = require('react'),
      serializeForm = require('mixins/serialize-form'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      BillingEditInfoForm = require('./billing-edit-info-form'),
      Responses = require('../responses');

  class BillingEditInfoModal extends React.Component {
    constructor(props) {
      super(props);
      this.handleResponse = this.handleResponse.bind(this);
      db.postStatus.addWatch("poll-update-user-billing", _.bind(this.handleResponse, this, null));
    }
    componentWillUnmount() {
      db.postStatus.removeWatch("poll-update-user-billing");
    }
    handleSubmit(e) {
      e.preventDefault();
      var data = serializeForm(this.refs.form);
      data.plan = 'quote';
      SotaDispatcher.dispatch({
        actionType: 'update-user-billing',
        data: data,
        setQuote: true
      });
    }
    handleResponse() {        
      var postStatus = !_.isUndefined(db.postStatus.deref()) ? db.postStatus.deref() : undefined;
      if(!_.isUndefined(postStatus['update-user-billing'])) {
        if(postStatus['update-user-billing'].status === 'success') {
          db.postStatus.removeWatch("poll-update-user-billing");
          delete postStatus['update-user-billing'];
          db.postStatus.reset(postStatus);
          this.props.closeModal();
        }
      }
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
