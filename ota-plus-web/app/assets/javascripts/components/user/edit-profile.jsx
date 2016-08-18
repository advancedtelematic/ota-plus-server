define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Loader = require('../loader'),
      ResponsesCustomMsg = require('../responses-custom-msg');

  class TestSettings extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      db.user.addWatch("poll-user-editprofile", _.bind(this.forceUpdate, this, null));
    }
    componentWillUnmount() {
      db.user.removeWatch("poll-user-editprofile");
    }
    handleSubmit(e) {
      e.preventDefault();
      
      var data = {};
      data.name = this.refs.username.value;
      
      SotaDispatcher.dispatch({
        actionType: 'update-user',
        data: data
      });
    }
    render() {
      var user = db.user.deref();
            
      return (
        <div className="row margin-top-70 ats">
          <div className="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3">
            <div className="ats-header text-center">
              <p>Edit profile</p>
            </div>
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              {!_.isUndefined(user) ?
                <div className="row">
                  <div className="col-lg-8 col-lg-offset-2">
                    <ResponsesCustomMsg 
                      action="update-user" 
                      successText="Profile has been updated." 
                      errorText="Error occured during profile update."/>
                    <form>
                      <div className="form-group">
                        <input className="form-control" type="text" name="fullname" placeholder="full name" id="fullname" ref="username" defaultValue={user.fullName}/>
                      </div>
                      <div className="form-group">
                        <input className="form-control" type="text" name="company" placeholder="institution or company" id="company" disabled/>
                      </div>
                      <div className="form-group">
                        <input className="form-control" type="email" name="email" placeholder="email address" id="email" disabled/>
                      </div>
                      <div className="form-group">
                        <input className="form-control" type="text" name="phone" placeholder="phone number" id="phone" disabled/>
                      </div>
                      <div className="form-group margin-top-30">
                        <button type="submit" className="ats-button" onClick={this.handleSubmit}>Save</button>
                      </div>
                      <div className="form-group">
                        <Link to="/" className="ats-button grey">Cancel</Link>
                      </div>
                      <div className="form-group">
                        <a href="/change_password" className="ats-button bordered">Change password</a>
                      </div>
                    </form>
                  </div>
                </div>
              : undefined}
            </VelocityTransitionGroup>
    
            {_.isUndefined(user) ?
              <Loader />
            : undefined}
          </div>
        </div>
      );
    }
  };

  TestSettings.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return TestSettings;
});
