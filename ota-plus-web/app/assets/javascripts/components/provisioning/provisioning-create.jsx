define(function(require) {
  var React = require('react'),
      moment = require('moment'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      Responses = require('../responses');

  class ProvisioningCreate extends React.Component {
    constructor(props) {
      super(props);
      this.closeModal = this.closeModal.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleResponse = this.handleResponse.bind(this);
      db.postStatus.addWatch("poll-add-provisioning-credential", _.bind(this.handleResponse, this, null));
    }
    componentDidMount() {
      jQuery(this.refs.validUntilGroup).datetimepicker({
         format: 'DD/MM/YYYY',
         defaultDate: new Date()
      });
    }
    componentWillUnmount() {
      db.postStatus.removeWatch("poll-add-provisioning-credential");
    }
    handleSubmit(e) {
      e.preventDefault();
      var data = {
        description: this.refs.deviceName.value,
        until: moment(jQuery(this.refs.validUntil).val(), "DD/MM/YYYY").format('YYYY-MM-DD')
      };
      SotaDispatcher.dispatch({
        actionType: 'add-provisioning-credential',
        data: data
      });
    }
    handleResponse() {        
      var postStatus = !_.isUndefined(db.postStatus.deref()) ? db.postStatus.deref() : undefined;
      if(!_.isUndefined(postStatus['add-provisioning-credential'])) {
        if(postStatus['add-provisioning-credential'].status === 'success') {
          db.postStatus.removeWatch("poll-add-provisioning-credential");
          var response = postStatus['add-provisioning-credential'].response;
          delete postStatus['add-provisioning-credential'];
          db.postStatus.reset(postStatus);
          setTimeout(function() {
            this.props.closeModal(true);
          }.bind(this), 1);
        }
      }
    }
    closeModal(e) {
      e.preventDefault();
      this.props.closeModal();
    }
    render() {
      return (
        <div id="modal-new-provisioning-key" className="myModal" role="dialog">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  <img src="/assets/img/icons/white/key.png" style={{width: 30}} alt="" /> &nbsp;
                  Create new key
                </h4>
              </div>
              <form ref='form' onSubmit={this.handleSubmit}>
                <div className="modal-body">
                  <Responses 
                    action="add-provisioning-credential" 
                    handledStatuses="error"/>
                  <div className="form-group">
                    <label htmlFor="deviceName">Device name</label>
                    <input type="text" className="form-control" name="deviceName" placeholder="Device name" ref="deviceName"/>
                  </div>
                  <div className="form-group position-relative">
                    <label htmlFor="validUntil">Valid until</label>
                    <div className="input-group" ref="validUntilGroup">
                      <input type="text" className="form-control form-addon" placeholder="" name="validUntil" ref="validUntil" />
                      <span className="input-group-addon">
                        <i className="fa fa-calendar-plus-o" aria-hidden="true"></i>
                      </span>
                    </div>
                    
                  </div>
                </div>
                <div className="modal-footer">
                  <a href="#" onClick={this.closeModal} className="darkgrey margin-top-20 pull-left">Cancel</a>
                  <button type="submit" className="btn btn-confirm pull-right">Confirm</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
  };

  return ProvisioningCreate;
});
