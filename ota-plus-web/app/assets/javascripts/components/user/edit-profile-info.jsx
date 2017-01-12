define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      Responses = require('../responses');

  class EditProfileInfo extends React.Component {
    constructor(props) {
      super(props);
    }
    handleChangePassword(e) {
      e.preventDefault();
      SotaDispatcher.dispatch({
        actionType: 'change-password',
      });
    }
    render() {
      const {user} = this.props;
      return (
        <div>
          <Responses 
            action="change-password" 
            successText="An email with password resetting instructions has been sent to your email account." 
            errorText="Error occured during password changing."/>
          {user.picture ? 
            <img src={user.picture} className="profile-icon" alt="" />
          :
            <img src="/assets/img/icons/profile_icon_big.png" className="profile-icon" alt="" />
          }
          <div className="profile-name">
            {user.fullName}
          </div>
          <hr />
          <div className="profile-email">
            <i className="fa fa-envelope-o"></i> {user.email}
          </div>
          <a href="#" className="btn btn-confirm margin-top-30" onClick={this.handleChangePassword.bind(this)}>Change password</a>
        </div>
      );
    }
  };

  return EditProfileInfo;
});
