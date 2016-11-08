define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      Responses = require('../responses');
  
  class CampaignCancelModal extends React.Component {
    constructor(props) {
      super(props);
      this.closeForm = this.closeForm.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      db.postStatus.addWatch("poll-cancel-campaign", _.bind(this.handleResponse, this, null));
    }
    componentWillUnmount() {
      db.postStatus.removeWatch("poll-cancel-campaign");
    }
    closeForm(e) {
      e.preventDefault();
      this.props.closeForm();
    }
    handleSubmit(e) {
      e.preventDefault();
      
      SotaDispatcher.dispatch({
        actionType: 'cancel-campaign',
        uuid: this.props.campaign.meta.id
      });
    }
    handleResponse() {
      var postStatus = !_.isUndefined(db.postStatus.deref()) ? db.postStatus.deref() : undefined;
      if(!_.isUndefined(postStatus['cancel-campaign'])) {
        if(postStatus['cancel-campaign'].status === 'success') {
          db.postStatus.removeWatch("poll-cancel-campaign");
          delete postStatus['cancel-campaign'];
          db.postStatus.reset(postStatus);
          this.props.closeForm(true);
        }
      }
    }
    render() {
      var campaign = this.props.campaign;
      return (
        <div id="modal-campaign-cancel" className="myModal">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header modal-header-red text-center">
                <h4 className="modal-title">
                  You're about to cancel a campaign
                </h4>
              </div>
              <div className="modal-body">
                <Responses action="cancel-campaign" handledStatuses="error"/>
                <div className="row text-center">
                  <div className="col-md-12">
                    <div>
                      <div className="campaign-icon"></div>
                      <div className="group-text text-left">
                        <div className="group-title">{campaign.meta.name}</div>
                        <div className="group-subtitle">{campaign.overallDevicesCount} affected devices</div>
                      </div>
                    </div>
                    <div className="margin-top-25">
                      <p>This campaign will not be executed on any further devices, and will be moved to <strong>Finished</strong>.</p>
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

  CampaignCancelModal.contextTypes = {
    history: React.PropTypes.object.isRequired,
    strings: React.PropTypes.object.isRequired,
  };

  return CampaignCancelModal;
});
