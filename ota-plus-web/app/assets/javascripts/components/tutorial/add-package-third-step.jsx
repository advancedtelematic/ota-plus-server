define(function(require) {
  var React = require('react');
        
  class AddPackageThirdStep extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div id="tutorial-add-package-third-step" className="tutorial-overlay tutorial-add-package arrow arrow-up">
          <div className="circle">3</div>
          <span className="font-20"><strong>History</strong></span>
        </div>
      );
    }
  };

  return AddPackageThirdStep;
});
