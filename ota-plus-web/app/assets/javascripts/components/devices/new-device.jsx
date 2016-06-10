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
      this.handleSubmit = this.handleSubmit.bind(this);
      this.state = {
        errors: null
      };
      
      db.postStatus.addWatch("poll-errors", _.bind(function() {
        this.setState({
          errors: db.postStatus.deref()['create-vehicle']
        });
      }, this));
    }
    componentWillUnmount() {
      db.postStatus.removeWatch("poll-errors");
    }      
    handleSubmit(e) {
      e.preventDefault();

      var payload = serializeForm(this.refs.form);
      SotaDispatcher.dispatch({
        actionType: 'create-vehicle',
        vehicle: payload
      });
    }
    render() {
      return (
        <form ref='form' onSubmit={this.handleSubmit}>
          {this.state.errors ?
            <div className="alert alert-danger">
              {this.state.errors}
            </div>
          : null}
          <div className="form-group">
            <label htmlFor="name">{this.context.strings.devicename}</label>
            <input type="text" className="form-control" name="vin" ref="vin" placeholder={this.context.strings.devicename}/>
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
