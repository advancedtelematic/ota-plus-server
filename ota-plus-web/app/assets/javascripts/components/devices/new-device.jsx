define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      _ = require('underscore'),
      serializeForm = require('../../mixins/serialize-form'),
      SotaDispatcher = require('sota-dispatcher');
    
  class NewDevice extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
      e.preventDefault();

      payload = serializeForm(this.refs.form);
      SotaDispatcher.dispatch({
        actionType: 'create-vehicle',
        vehicle: payload
      });
    }
    render() {
      return (
        <form ref='form' onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">{this.props.strings.devicename}</label>
            <input type="text" className="form-control" name="vin" ref="vin" placeholder={this.props.strings.devicename}/>
          </div>
          <div className="form-group text-right">
            <button type="submit" className="btn btn-grey">{this.props.strings.adddevice}</button>
          </div>
        </form>  
      );
    }
  };

  return NewDevice;
});
