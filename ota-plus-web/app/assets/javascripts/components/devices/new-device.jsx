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
      this.closeNewDeviceModal = this.closeNewDeviceModal.bind(this);
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
    closeNewDeviceModal(e) {
      e.preventDefault();
      this.props.closeNewDeviceModal();
    }
    render() {
      return (
        <div id="modal-new-device" className="myModal" role="dialog">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={this.props.closeNewDeviceModal}></button>
                <h4 className="modal-title">{this.context.strings.newdevice}</h4>
              </div>
              <form ref='form' onSubmit={this.handleSubmit}>
                <div className="modal-body">
                  <Responses action="create-device" handledStatuses="error"/>
                  <div className="form-group">
                    <label htmlFor="deviceName">{this.context.strings.devicename}</label>
                    <input type="text" className="form-control" name="deviceName"
                         ref="deviceName" placeholder={this.context.strings.devicename}/>
                  </div>
                </div>
                <div className="modal-footer">
                  <a href="#" onClick={this.closeNewDeviceModal} className="darkgrey margin-top-20 pull-left">close</a>
                  <button type="submit" className="btn btn-confirm pull-right">{this.context.strings.adddevice}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
  };

  NewDevice.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return NewDevice;
});
