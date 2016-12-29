define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Loader = require('../loader');

  class Profile extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      var user = db.user.deref();
        
      return (
        <div className="dropdown-menu dropdown-profile dropdown-right">
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {!_.isUndefined(user) ?
              <div>
                <div className="width-100 text-center pull-left">
                  {user.picture ? 
                    <img src={user.picture} className="profile-icon" alt="" id="icon-profile"/>
                  :
                    <img src="/assets/img/icons/profile_icon_big.png" className="profile-icon" alt="" />
                  }
                </div>
                <div className="width-100 text-center margin-top-10 pull-left">
                  <div>
                    <strong><span className="username">{user.fullName}</span></strong>
                  </div>
                  <div>
                    <span className="email">{user.email}</span>
                  </div>
                </div>
              </div>
            : undefined}
          </VelocityTransitionGroup>
            
          {_.isUndefined(user) ?
            <Loader />
          : undefined}
          <hr />
          
          <div className="profile-links">
            <div>
              <Link to="editprofile" id="link-editprofile">Edit profile</Link>
            </div>
            <div>
              <Link to="/usage" id="link-usage">Usage</Link>
            </div>
            <div>
              <a href="#" onClick={this.props.logout} id="link-signout">Sign out</a>
            </div>
          </div>
        </div>  
      );
    }
  };

  return Profile;
});
