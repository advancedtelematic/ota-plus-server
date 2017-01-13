define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      Responses = require('../responses');

  class CampaignRename extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.closeModal = this.closeModal.bind(this);
      this.handleResponse = this.handleResponse.bind(this);
      db.postStatus.addWatch("poll-rename-campaign", _.bind(this.handleResponse, this, null));
    }
    componentWillUnmount() {
      db.postStatus.removeWatch("poll-rename-campaign");
    }
    handleSubmit(e) {
      e.preventDefault();
      SotaDispatcher.dispatch({
        actionType: 'rename-campaign',
        uuid: this.props.campaign.id,
        data: {name: this.refs.campaignName.value}
      });
    }
    closeModal(e) {
      e.preventDefault();
      this.props.closeModal();
    }
    handleResponse() {
      var postStatus = !_.isUndefined(db.postStatus.deref()) ? db.postStatus.deref() : undefined;
      if(!_.isUndefined(postStatus['rename-campaign']) && postStatus['rename-campaign'].status === 'success') {
        var that = this;
        db.postStatus.removeWatch("poll-rename-campaign");
        delete postStatus['rename-campaign'];
        db.postStatus.reset(postStatus);
        setTimeout(function() {
          that.props.closeModal(true);
        }, 1);
      }
    }
    render() {
      return (
        <div className="myModal" role="dialog">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  <img src="/assets/img/icons/edit_white.png" className="blacklist-edit-icon" style={{width: '30px'}} alt="" />&nbsp;
                  Rename campaign - {this.props.campaign.name}
                </h4>
              </div>
              <form ref='form' onSubmit={this.handleSubmit}>
                <div className="modal-body">
                  <Responses action="rename-campaign" handledStatuses="error"/>
                  <div className="form-group">
                    <label htmlFor="campaignName">New campaign name</label>
                    <input type="text" className="form-control" name="campaignName"
                         ref="campaignName" defaultValue={this.props.campaign.name}/>
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

  return CampaignRename;
});
