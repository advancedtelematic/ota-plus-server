define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      serializeForm = require('mixins/serialize-form'),
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
    handleSubmit(e) {
      e.preventDefault();
      var data = serializeForm(this.refs.form);
      SotaDispatcher.dispatch({
        actionType: 'update-user',
        data: data
      });
    }
    render() {
      const { user } = this.props;
      return (
        <div className="panel panel-grey">
          <div className="panel-heading">Personal information</div>
          <div className="panel-body">
            <Responses 
              action="change-password" 
              successText="An email with password resetting instructions has been sent to your email account." 
              errorText="Error occured during password changing."/>
            <Responses 
              action="update-user" 
              successText="Profile has been updated." 
              errorText="Error occured during profile update."/>
            {user.picture ? 
              <img src={user.picture} className="profile-icon" alt="" />
            :
              <img src="/assets/img/icons/profile_icon_big.png" className="profile-icon" alt="" />
            }
            <form ref="form" onSubmit={this.handleSubmit.bind(this)} id="form-personal-information">
              <div className="form-group text-left">
                <label htmlFor="input-name">Display name</label>
                <input type="text" className="form-control" name="name" id="input-name" defaultValue={user.fullName} required/>
              </div>
              <div className="form-group text-left">
                <label htmlFor="input-login">Login</label>
                <input type="text" className="form-control" id="input-login" defaultValue={user.email} disabled/>
              </div>
              <button type="submit" className="btn btn-confirm">Update details</button>
            </form>
            <a href="#" className="btn btn-confirm margin-top-30" onClick={this.handleChangePassword.bind(this)}>Change password</a>
          </div>
        </div>
      );
    }
  };

  return EditProfileInfo;
});
