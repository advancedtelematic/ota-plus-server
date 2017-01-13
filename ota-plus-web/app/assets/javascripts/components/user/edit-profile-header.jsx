define(function(require) {
  var React = require('react');
      
  class EditProfileHeader extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div className="grey-header">      
          <div className="col-md-12">
            <div className="grey-header-icon"></div>
            <div className="grey-header-text">
              <div className="grey-header-title">Profile</div>
            </div>
          </div>
        </div>
      );
    }
  };

  return EditProfileHeader;
});
