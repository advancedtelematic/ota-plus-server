define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      _ = require('underscore'),
      db = require('stores/db'),
      serializeForm = require('../../mixins/serialize-form'),
      SotaDispatcher = require('sota-dispatcher'),
      Responses = require('../responses');

  class RenameDevice extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.closeRenameDeviceModal = this.closeRenameDeviceModal.bind(this);
      this.renameDeviceListener = this.renameDeviceListener.bind(this);
      
      db.postStatus.addWatch("poll-poststatus-edit-device", _.bind(this.renameDeviceListener, this, null));
    }
    componentWillUnmount() {
      db.postStatus.removeWatch("poll-poststatus-edit-device");
    }
    handleSubmit(e) {
      e.preventDefault();

      var payload = serializeForm(this.refs.form);
      payload.deviceId = payload.deviceName;
      payload.deviceType = 'Other';
      SotaDispatcher.dispatch({
        actionType: 'edit-device',
        device: payload,
        uuid: this.props.device.uuid
      });
    }
    closeRenameDeviceModal(e) {
      e.preventDefault();
      this.props.closeRenameDeviceModal(false);
    }
    renameDeviceListener() {
      var that = this;
      var postStatusRenameDevice = db.postStatus.deref()['edit-device'];
      if(!_.isUndefined(postStatusRenameDevice) && postStatusRenameDevice.status === 'success') {
        setTimeout(function() {
          that.props.closeRenameDeviceModal(true);
        }, 1);
      }
    }
    render() {
      return (
        <div id="modal-new-device" className="myModal" role="dialog">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={this.props.closeRenameDeviceModal}></button>
                <h4 className="modal-title">
                  <img src="/assets/img/icons/edit_white.png" className="blacklist-edit-icon" style={{width: '30px'}} alt="" />&nbsp;
                  Rename device
                </h4>
              </div>
              <form ref='form' onSubmit={this.handleSubmit}>
                <div className="modal-body">
                  <Responses 
                    action="edit-device" 
                    successText="Device name has been changed."/>
                  <div className="form-group">
                    <label htmlFor="deviceName">Name</label>
                    <input type="text" className="form-control" name="deviceName"
                         ref="deviceName" defaultValue={this.props.device.deviceName}/>
                  </div>
                </div>
                <div className="modal-footer">
                  <a href="#" onClick={this.closeRenameDeviceModal} className="darkgrey margin-top-20 pull-left">close</a>
                  <button type="submit" className="btn btn-confirm pull-right">Confirm</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
  };

  RenameDevice.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return RenameDevice;
});
