define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Loader = require('../loader'),
      Responses = require('../responses'),
      ReactI18next = require('reactI18next');

  class TestSettings extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.changePassword = this.changePassword.bind(this);
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
    changePassword(e) {
      e.preventDefault();
      SotaDispatcher.dispatch({
        actionType: 'change-password',
      });
    }
    render() {    
      var user = db.user.deref();
      const { t } = this.props;
      return (
        <div className="row margin-top-70 ats">
          <div className="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3">
            <div className="ats-header text-center">
              <p>{t('editprofile.title')}</p>
            </div>
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              {!_.isUndefined(user) ?
                <div className="row">
                  <div className="col-lg-8 col-lg-offset-2">
                    <Responses 
                      action="update-user" 
                      successText="Profile has been updated." 
                      errorText="Error occured during profile update."/>
                    <Responses 
                      action="change-password" 
                      successText="An email with password resetting instructions has been sent to your email account." 
                      errorText="Error occured during password changing."/>
                    <form>
                      <div className="form-group">
                        <input className="form-control" type="text" name="fullname" placeholder="full name" id="fullname" ref="username" defaultValue={user.fullName}/>
                      </div>
                      <div className="form-group margin-top-30">
                        <button type="submit" className="ats-button" onClick={this.handleSubmit}>Save</button>
                      </div>
                      <div className="form-group">
                        <Link to="/" className="ats-button grey">Cancel</Link>
                      </div>
                      <div className="form-group">
                        <a href="#" className="ats-button bordered" onClick={this.changePassword}>Change password</a>
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

  return ReactI18next.translate()(TestSettings);
});
