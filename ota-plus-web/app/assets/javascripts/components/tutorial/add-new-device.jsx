define(function(require) {
  var React = require('react');
        
  class AddNewDevice extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div id="tutorial-add-new-device" className="tutorial-overlay arrow arrow-up">
          <img src="/assets/img/logo.png" alt="" className="logo" />
          <span className="font-24"><strong>Welcome!</strong></span>
          
          <div className="margin-top-30 font-20">
            <div>
              <strong>Get started by adding your first device here</strong>
            </div>
          </div>
        </div>
      );
    }
  };

  return AddNewDevice;
});
