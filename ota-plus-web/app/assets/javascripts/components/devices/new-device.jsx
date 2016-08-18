define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      _ = require('underscore'),
      db = require('stores/db'),
      serializeForm = require('../../mixins/serialize-form'),
      SotaDispatcher = require('sota-dispatcher');

  class NewDevice extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        errors: null
      };
      this.handleSubmit = this.handleSubmit.bind(this);
      db.postStatus.addWatch("poll-errors", _.bind(this.forceUpdate, this, null));
    }
    componentWillUnmount() {
      db.postStatus.reset([]);
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
        <form ref='form' onSubmit={this.handleSubmit}>
          {db.postStatus.deref()['create-device'] ?
            <div className="alert alert-danger">
              {db.postStatus.deref()['create-device']}
            </div>
          : null}
          <div className="form-group">
            <label htmlFor="deviceName">{this.context.strings.devicename}</label>
            <input type="text" className="form-control" name="deviceName"
                   ref="deviceName" placeholder={this.context.strings.devicename}/>
          </div>
          <div className="form-group text-right">
            <button type="submit" className="btn btn-grey">{this.context.strings.adddevice}</button>
          </div>
        </form>
      );
    }
  };

  NewDevice.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return NewDevice;
});
