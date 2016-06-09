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
    toggleEditField() {
      this.setState({
        showEditField: !this.state.showEditField
      });
    }
    toggleEditButton(state) {
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
    handleSubmit() {
      this.setState({
        username: this.refs.username.value
      });
      this.toggleEditField();
    }
    render() {
      return (
        <div className="dropdown-menu dropdown-box dropdown-right">
          <form className="user-form margin-10" ref="userForm">
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
                <strong><span className="brown">{this.state.username}</span></strong>
                {this.state.showEditButton ? 
                  <a href="#" className="pencil-button pull-right" onClick={this.toggleEditField}>
                    <img src="/assets/img/icons/edit_icon.png" alt="" />
                  </a>
                : null}
              </div>
            }
          </form>
          <div className="margin-10">
            <a href="/change_password">Change password</a>
          </div>
          <hr />
          <div className="margin-10">
            <a href="/logout" className="orange">Log out</a>
          </div>
        </div>  
      );
    }
  };

  return ChangePassword;
});
