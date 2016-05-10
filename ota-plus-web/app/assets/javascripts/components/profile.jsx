define(function(require) {
  var React = require('react'),
      Router = require('react-router');
	
  var Profile = React.createClass({
    render: function() {
      return (
        <div>
          <div className="row">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <h3>{this.context.strings.profile}</h3>
                </div>
                <div className="col-md-6">
                  <div className="thumbnail">
                    <img src="http://cerebral-overload.com/wp-content/uploads/2016/02/ATS-AdvancedTelematicSystems-OTAPlus-RGB.jpg" alt="" />
                  </div>
                </div>
                <div className="col-md-6">
                  <ul className="list-group">
                    <li className="list-group-item">Your name: <strong>John Kowalski</strong></li>
                    <li className="list-group-item">Your address: <strong>Kantstrasse 162 10623 Berlin, Germany</strong></li>
                    <li className="list-group-item">Your phone: <strong>+4930959997540</strong></li>
                    <li className="list-group-item">Your email address: <strong>ats.berlin@advancedtelematic.com</strong></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <h3>{this.context.strings.editpassword}</h3>
                </div>
                <div className="col-md-6">
                  <form ref='form'>
                    <div className="form-group">
                      <label>Old password</label>
                      <input type="text" className="form-control" name="oldpassword" placeholder="Old password"/>
                    </div>
                    <div className="form-group">
                      <label>New password</label>
                      <input type="text" className="form-control" name="newpassword" placeholder="New password"/>
                    </div>
                    <div className="form-group">
                      <label>Confirm new password</label>
                      <input type="text" className="form-control" name="newpasswordconfirm" placeholder="Confirm new password"/>
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary">Save changes</button>
                    </div>
                  </form>  
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  });

  Profile.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return Profile;
});
