define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      _ = require('underscore'),
      db = require('stores/db'),
      serializeForm = require('../../mixins/serialize-form'),
      SotaDispatcher = require('sota-dispatcher'),
      Responses = require('../responses');

  class RenameGroup extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.closeRenameGroupModal = this.closeRenameGroupModal.bind(this);
      this.handleResponse = this.handleResponse.bind(this);
      db.postStatus.addWatch("poll-rename-group", _.bind(this.handleResponse, this, null));
    }
    componentWillUnmount() {
      db.postStatus.removeWatch("poll-rename-group");
    }
    handleSubmit(e) {
      e.preventDefault();
      var payload = serializeForm(this.refs.form);
      SotaDispatcher.dispatch({
        actionType: 'rename-group',
        uuid: this.props.group.id,
        groupName: payload.groupName,
        data: {}
      });
    }
    closeRenameGroupModal(e) {
      e.preventDefault();
      this.props.closeRenameGroupModal();
    }
    handleResponse() {
      var postStatus = !_.isUndefined(db.postStatus.deref()) ? db.postStatus.deref() : undefined;
      if(!_.isUndefined(postStatus['rename-group']) && postStatus['rename-group'].status === 'success') {
        var that = this;
        db.postStatus.removeWatch("poll-rename-group");
        delete postStatus['rename-group'];
        db.postStatus.reset(postStatus);
        setTimeout(function() {
          that.props.closeRenameGroupModal(true);
        }, 1);
      }
    }
    render() {
      return (
        <div id="modal-new-device" className="myModal" role="dialog">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={this.props.closeRenameGroupModal}></button>
                <h4 className="modal-title">
                  <img src="/assets/img/icons/edit_white.png" className="blacklist-edit-icon" style={{width: '30px'}} alt="" />&nbsp;
                  Rename group - {this.props.group.groupName}
                </h4>
              </div>
              <form ref='form' onSubmit={this.handleSubmit}>
                <div className="modal-body">
                  <Responses action="rename-group" handledStatuses="error"/>
                  <div className="form-group">
                    <label htmlFor="groupName">New group name</label>
                    <input type="text" className="form-control" name="groupName"
                         ref="groupName" defaultValue={this.props.group.groupName}/>
                  </div>
                </div>
                <div className="modal-footer">
                  <a href="#" onClick={this.closeRenameGroupModal} className="darkgrey margin-top-20 pull-left">Cancel</a>
                  <button type="submit" className="btn btn-confirm pull-right">Confirm</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
  };

  return RenameGroup;
});
