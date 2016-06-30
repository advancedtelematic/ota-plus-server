define(function(require) {
  var React = require('react');
        
  class AddPackageSecondStep extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div id="tutorial-add-package-second-step" className="tutorial-overlay tutorial-add-package arrow arrow-left">
          <div className="circle">2</div>
          <span className="font-20"><strong>Install package</strong></span>
        </div>
      );
    }
  };

  return AddPackageSecondStep;
});
