define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Loader = require('../loader'),
      ReactI18next = require('reactI18next'),
      EditProfileHeader = require('./edit-profile-header'),
      EditProfileInfo = require('./edit-profile-info'),
      EditProfileBilling = require('./edit-profile-billing');

  class EditProfile extends React.Component {
    constructor(props) {
      super(props);
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
      const user = db.user.deref();
      const { t } = this.props;
      return (
        <span>
          <VelocityTransitionGroup enter={{animation: "fadeIn", display: "flex"}} leave={{animation: "fadeOut", display: "flex"}} runOnMount={true}>
            {!_.isUndefined(user) ?
              <div className="content-wrapper">
                <EditProfileHeader />
                <div className="edit-profile-content">
                  <div className="edit-profile-content-left">
                     <EditProfileInfo 
                      user={user}/>
                   </div>
                   <div className="edit-profile-content-right">
                    <EditProfileBilling 
                      user={user}/>
                  </div>
                </div>
              </div>
            : undefined}
          </VelocityTransitionGroup>
          {_.isUndefined(user) ?
            <Loader />
           : undefined}
        </span>
      );
    }
  };

  return ReactI18next.translate()(EditProfile);
});
