define(function(require) {
  var React = require('react');
        
  class AddPackageFirstStep extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div id="tutorial-add-package-first-step" className="tutorial-overlay tutorial-add-package arrow arrow-left">
          <div className="width-20 pull-left">
            <div className="circle">1</div>
          </div>
          <div className="width-80 margin-top-10 pull-left">
            <span className="font-20"><strong>Start</strong></span>
            <div className="margin-top-20 font-16">
              Drop down here your own<br /> packages to get started.
            </div>
          </div>
        </div>
      );
    }
  };

  return AddPackageFirstStep;
});
