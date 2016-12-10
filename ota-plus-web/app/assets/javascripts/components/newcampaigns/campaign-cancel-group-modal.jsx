define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      Responses = require('../responses');
  
  class CampaignCancelGroupModal extends React.Component {
    constructor(props) {
      super(props);
      this.closeForm = this.closeForm.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      db.postStatus.addWatch("poll-cancel-campaign-for-request", _.bind(this.handleResponse, this, null));
    }
    componentWillUnmount() {
      db.postStatus.removeWatch("poll-cancel-campaign-for-request");
    }
    closeForm(e) {
      e.preventDefault();
      this.props.closeForm();
    }
    handleSubmit(e) {
      e.preventDefault();
      
      SotaDispatcher.dispatch({
        actionType: 'cancel-campaign-for-request',
        uuid: this.props.group.updateRequest
      });
    }
    handleResponse() {
      var postStatus = !_.isUndefined(db.postStatus.deref()) ? db.postStatus.deref() : undefined;
      if(!_.isUndefined(postStatus['cancel-campaign-for-request'])) {
        if(postStatus['cancel-campaign-for-request'].status === 'success') {
          db.postStatus.removeWatch("poll-cancel-campaign-for-request");
          delete postStatus['cancel-campaign-for-request'];
          db.postStatus.reset(postStatus);
          this.props.closeForm(true);
        }
      }
    }
    render() {
      var group = this.props.group;
      return (
        <div id="modal-campaign-cancel" className="myModal">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header modal-header-red text-center">
                <h4 className="modal-title">
                  You're about to cancel {group.meta.name} for group {group.groupName}
                </h4>
              </div>
              <div className="modal-body">
                <Responses action="cancel-campaign-for-request" handledStatuses="error"/>
                <div className="row text-center">
                  <div className="col-md-12">
                    <div>
                      <div className="group-icon"></div>
                      <div className="group-text text-left">
                        <div className="group-title">{group.groupName}</div>
                        <div className="group-subtitle">{group.statistics.deviceCount} devices</div>
                      </div>
                    </div>
                    <div className="margin-top-25">
                      <p>This campaign will not be installable anymore for devices in group {group.groupName}, and all devices in the group will be moved to <strong>Finished</strong>.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <a href="#" className="darkgrey margin-top-20 pull-left" onClick={this.closeForm}>cancel</a>
                <div>
                  <button type="submit" className="btn btn-confirm pull-right" onClick={this.handleSubmit}>Confirm</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  CampaignCancelGroupModal.contextTypes = {
    history: React.PropTypes.object.isRequired,
    
  };

  return CampaignCancelGroupModal;
});
