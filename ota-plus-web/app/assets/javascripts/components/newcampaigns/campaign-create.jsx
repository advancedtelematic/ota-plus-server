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
      
      db.postStatus.addWatch("poll-response-create-new-campaign", _.bind(this.handleResponse, this, null));
    }
    componentWillUnmount() {
      db.postStatus.removeWatch("poll-response-create-new-campaign");
    }
    handleSubmit(e) {
      e.preventDefault();
      
      SotaDispatcher.dispatch({
        actionType: 'create-campaign',
        data: {name: this.refs.campaignName.value}
      });
    }
    handleResponse() {
      var postStatus = !_.isUndefined(db.postStatus.deref()) ? db.postStatus.deref()['create-campaign'] : undefined;
      
      if(!_.isUndefined(postStatus)) {
        if(postStatus.status === 'success') {
          setTimeout(function() {
            SotaDispatcher.dispatch({actionType: 'get-campaigns'});
          }, 1);
          this.props.openWizard(postStatus.response);
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
                <button type="button" className="close" onClick={this.props.closeModal}></button>
                <h4 className="modal-title">
                  <i className="fa fa-plus"></i> &nbsp;
                  Create new Campaign
                </h4>
              </div>
              <form ref='form' onSubmit={this.handleSubmit}>
                <div className="modal-body">
                  <Responses action="create-campaign" handledStatuses="error"/>
                  <div className="form-group">
                    <label htmlFor="campaignName">Name</label>
                    <input type="text" className="form-control" name="campaignName" ref="campaignName"/>
                  </div>
                </div>
                <div className="modal-footer">
                  <a href="#" onClick={this.closeModal} className="darkgrey margin-top-20 pull-left">close</a>
                  <button type="submit" className="btn btn-confirm pull-right">Confirm</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
  };

  CampaignCreate.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return CampaignCreate;
});
