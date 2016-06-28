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
              <strong>1. </strong> Lorem ipsum dolor sit amet enim
            </div>
            <div className="margin-top-20">
              <strong>2. </strong> Lorem ipsum dolor sit amet enim es dolores
            </div>
            <div className="margin-top-20">
              <strong>3. </strong> Lorem ipsum dolor
            </div>
          </div>
        </div>
      );
    }
  };

  return AddNewDevice;
});
