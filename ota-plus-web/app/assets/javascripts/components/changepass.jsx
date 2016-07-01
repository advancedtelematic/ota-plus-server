define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      SotaDispatcher = require('sota-dispatcher');

  class ChangePassword extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        showEditField: false,
        showEditButton: false,
        usernameFieldLength: 0,
        username: 'Username',
      };
      this.toggleEditField = this.toggleEditField.bind(this);
      this.changeUsernameFieldLength = this.changeUsernameFieldLength.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    toggleEditField(e) {
     if(e !== undefined)
       e.preventDefault();
     this.setState({
        showEditField: !this.state.showEditField
      });
    }
    toggleEditButton(state, e) {
      e.preventDefault();
      this.setState({
        showEditButton: state
      })
    }
    changeUsernameFieldLength() {
      var val = this.refs.username.value;
      this.setState({
        usernameFieldLength: val.length
      });
    }
    handleSubmit(e) {
      e.preventDefault();
      this.setState({
        username: this.refs.username.value
      });
      this.toggleEditField();
    }
    render() {
      return (
        <div className="dropdown-menu dropdown-profile dropdown-right">
          <form className="user-form" ref="userForm">
            <div className="width-100 text-center pull-left">
              <img src="/assets/img/icons/profile_icon_big.png" className="profile-icon" alt="" />
            </div>
            <div className="width-100 text-center margin-top-10 pull-left">
            {this.state.showEditField ?
              <div>
                <input className="input-username" name="username" type="text" placeholder={this.state.username} ref="username" onKeyUp={this.changeUsernameFieldLength}/>
                
                {this.state.usernameFieldLength > 0 ?
                  <div className="pull-right">
                    <a href="#" className="accept-button" onClick={this.handleSubmit}>
                      <img src="/assets/img/icons/accept_icon.png" alt="" />
                    </a>
                    &nbsp;
                    <a href="#" className="cancel-button" onClick={this.toggleEditField}>
                      <img src="/assets/img/icons/close_icon.png" alt="" />
                    </a>
                  </div>
                :
                  <a href="#" className="pencil-button pencil-button-edit pull-right" onClick={this.toggleEditField}>
                    <img src="/assets/img/icons/edit_icon.png" alt="" />
                  </a>      
                }
              </div>
            : 
              <div onMouseEnter={this.toggleEditButton.bind(this, true)} onMouseLeave={this.toggleEditButton.bind(this, false)}>
                <strong><span className="username">{this.state.username}</span></strong>
                {this.state.showEditButton ? 
                  <a href="#" className="pencil-button pull-right" onClick={this.toggleEditField}>
                    <img src="/assets/img/icons/edit_icon.png" alt="" />
                  </a>
                : null}
              </div>
            }
            <div>
              <span className="email">email@address.com</span>
            </div>
            </div>
          </form>
          <hr />
          
          <div className="profile-links">
            <div>
              <a href="/edit_profile">Edit profile</a>
            </div>
            <div>
              <a href="#">Upgrade plan</a>
            </div>
            <div>
              <a href="/logout">Sign out</a>
            </div>
          </div>
        </div>  
      );
    }
  };

  return ChangePassword;
});
