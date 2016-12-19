define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      _ = require('underscore'),
      db = require('stores/db'),
      serializeForm = require('../../mixins/serialize-form'),
      SotaDispatcher = require('sota-dispatcher'),
      Responses = require('../responses');

  class NewDevice extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleResponse = this.handleResponse.bind(this);
      this.closeNewDeviceModal = this.closeNewDeviceModal.bind(this);
      db.postStatus.addWatch("poll-create-device", _.bind(this.handleResponse, this, null));
    }
    componentWillUnmount() {
      db.postStatus.removeWatch("poll-create-device");
    }
    handleSubmit(e) {
      e.preventDefault();
      var payload = serializeForm(this.refs.form);
      payload.deviceId = payload.deviceName;
      payload.deviceType = 'Other';
      SotaDispatcher.dispatch({
        actionType: 'create-device',
        device: payload
      });
    }
    handleResponse() {
      var postStatus = !_.isUndefined(db.postStatus.deref()) ? db.postStatus.deref() : undefined;
      if(!_.isUndefined(postStatus['create-device'])) {
        if(postStatus['create-device'].status === 'success') {
          var deviceUUID = postStatus['create-device'].response;
          db.postStatus.removeWatch("poll-create-device");
          delete postStatus['create-device'];
          db.postStatus.reset(postStatus);
          if(this.props.selectedGroup.type == 'real') {
            var that = this;
            setTimeout(function() {
              SotaDispatcher.dispatch({
                actionType: 'add-device-to-group',
                uuid: that.props.selectedGroup.uuid,
                deviceId: deviceUUID
              });
            }, 1);
          }
        }
      }
    }
    closeNewDeviceModal(e) {
      e.preventDefault();
      this.props.closeNewDeviceModal();
    }
    render() {
      var selectedGroup = this.props.selectedGroup;
      return (
        <div id="modal-new-device" className="myModal" role="dialog">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={this.props.closeNewDeviceModal}></button>
                <h4 className="modal-title">
                  Add new device
                  {selectedGroup && selectedGroup.type == 'real' ?
                    <span> in the {selectedGroup.name} group</span>
                  : null}
                </h4>
              </div>
              <form ref='form' onSubmit={this.handleSubmit}>
                <div className="modal-body">
                  <Responses action="create-device" handledStatuses="error"/>
                  <div className="form-group">
                    <label htmlFor="deviceName">Device name</label>
                    <input type="text" className="form-control" name="deviceName"
                         ref="deviceName" placeholder="Device name"/>
                  </div>
                </div>
                <div className="modal-footer">
                  <a href="#" onClick={this.closeNewDeviceModal} className="darkgrey margin-top-20 pull-left">Cancel</a>
                  <button type="submit" className="btn btn-confirm pull-right">Add device</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
  };

  return NewDevice;
});
