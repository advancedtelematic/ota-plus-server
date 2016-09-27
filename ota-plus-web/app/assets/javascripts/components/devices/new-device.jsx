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
    render() {
      return (
        <div id="modal-new-device" className="myModal" role="dialog">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={this.props.closeNewDeviceModal}></button>
                <h4 className="modal-title">{this.context.strings.newdevice}</h4>
              </div>
              <div className="modal-body">
                <form ref='form' onSubmit={this.handleSubmit}>
                  <Responses action="create-device" />
                  <div className="form-group">
                    <label htmlFor="deviceName">{this.context.strings.devicename}</label>
                    <input type="text" className="form-control" name="deviceName"
                         ref="deviceName" placeholder={this.context.strings.devicename}/>
                  </div>
                  <div className="form-group text-right">
                    <button type="submit" className="btn btn-grey">{this.context.strings.adddevice}</button>
                  </div>
                </form>
              </div>
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
