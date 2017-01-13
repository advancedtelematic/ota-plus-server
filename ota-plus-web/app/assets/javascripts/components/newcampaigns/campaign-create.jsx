define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      _ = require('underscore'),
      db = require('stores/db'),
      serializeForm = require('../../mixins/serialize-form'),
      SotaDispatcher = require('sota-dispatcher'),
      Responses = require('../responses');

  class CampaignCreate extends React.Component {
    constructor(props) {
      super(props);
      this.closeModal = this.closeModal.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleResponse = this.handleResponse.bind(this);
      db.postStatus.addWatch("poll-create-new-campaign", _.bind(this.handleResponse, this, null));
    }
    componentWillUnmount() {
      db.postStatus.removeWatch("poll-create-new-campaign");
    }
    handleSubmit(e) {
      e.preventDefault();
      SotaDispatcher.dispatch({
        actionType: 'create-campaign',
        data: {name: this.refs.campaignName.value}
      });
    }
    handleResponse() {        
      var postStatus = !_.isUndefined(db.postStatus.deref()) ? db.postStatus.deref() : undefined;
      if(!_.isUndefined(postStatus['create-campaign'])) {
        if(postStatus['create-campaign'].status === 'success') {
          db.postStatus.removeWatch("poll-create-new-campaign");
          var response = postStatus['create-campaign'].response;
          delete postStatus['create-campaign'];
          db.postStatus.reset(postStatus);
          this.props.openWizard({id: response}, true);
        }
      }
    }
    closeModal(e) {
      e.preventDefault();
      this.props.closeModal();
    }
    render() {
      return (
        <div id="modal-new-campaign" className="myModal" role="dialog">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  <img src="/assets/img/icons/white/campaigns.png" className="create-campaign-icon" alt="" /> &nbsp;
                  Add new Campaign
                </h4>
              </div>
              <form ref='form' onSubmit={this.handleSubmit}>
                <div className="modal-body">
                  <Responses action="create-campaign" handledStatuses="error"/>
                  <div className="form-group">
                    <label htmlFor="campaignName">Campaign name</label>
                    <input type="text" className="form-control" name="campaignName" placeholder="Campaign name" ref="campaignName"/>
                  </div>
                </div>
                <div className="modal-footer">
                  <a href="#" onClick={this.closeModal} className="darkgrey margin-top-20 pull-left">Cancel</a>
                  <button type="submit" className="btn btn-confirm pull-right">Add campaign</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
  };

  return CampaignCreate;
});
