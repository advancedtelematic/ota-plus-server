define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      _ = require('underscore'),
      db = require('stores/db'),
      serializeForm = require('../../mixins/serialize-form'),
      SotaDispatcher = require('sota-dispatcher'),
      Responses = require('../responses');

  class NewManualGroup extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleResponse = this.handleResponse.bind(this);
      this.closeModal = this.closeModal.bind(this);
      db.postStatus.addWatch("poll-create-manual-group", _.bind(this.handleResponse, this, null));
    }
    componentWillUnmount() {
      db.postStatus.removeWatch("poll-create-manual-group");
    }
    handleSubmit(e) {
      e.preventDefault();
      SotaDispatcher.dispatch({
        actionType: 'create-manual-group',
        name: this.refs.groupName.value
      });
    }
    handleResponse() {
      var postStatus = !_.isUndefined(db.postStatus.deref()) ? db.postStatus.deref() : undefined;
      if(!_.isUndefined(postStatus['create-manual-group']) && postStatus['create-manual-group'].status === 'success') {
        var that = this;
        var groupUUID = postStatus['create-manual-group'].response;
        db.postStatus.removeWatch("poll-create-manual-group");
        delete postStatus['create-manual-group'];
        db.postStatus.reset(postStatus);
                
        if(this.props.deviceUUID !== null) {
          setTimeout(function() {
            SotaDispatcher.dispatch({
              actionType: 'add-device-to-group',
              uuid: groupUUID,
              deviceId: that.props.deviceUUID
            });
          }, 1);
        }
        setTimeout(function() {
          that.props.closeModal(true);
        }, 1);
      }
    }
    closeModal(e) {
      e.preventDefault();
      this.props.closeModal();
    }
    render() {    
      return (
        <div id="modal-create-group" className="myModal" role="dialog">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={this.props.closeModal}></button>
                <h4 className="modal-title">
                  <img src="/assets/img/icons/grid.png" className="create-group-icon" style={{width: '20px'}} alt="" /> &nbsp;
                  Add new group
                </h4>
              </div>
              <form ref='form' onSubmit={this.handleSubmit}>
                <div className="modal-body">
                  <Responses action="create-manual-group" handledStatuses="error"/>
                  <div className="form-group">
                    <label htmlFor="groupName">Group name</label>
                    <input type="text" className="form-control" name="groupName"
                      placeholder="Group name" ref="groupName"/>
                  </div>
                </div>
                <div className="modal-footer">
                  <a href="#" onClick={this.closeModal} className="darkgrey margin-top-20 pull-left">Cancel</a>
                  <button type="submit" className="btn btn-confirm pull-right">Add group</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
  };

  return NewManualGroup;
});
