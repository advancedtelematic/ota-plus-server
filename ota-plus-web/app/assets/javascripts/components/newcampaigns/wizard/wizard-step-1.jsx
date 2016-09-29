define(function(require) {
  var React = require('react'),
      PackagesList = require('./wizard-step-1/packages-list');

  class WizardStep1 extends React.Component {
    constructor(props) {
      super(props);
      this.setWizardData = this.setWizardData.bind(this);
    }
    setWizardData(packageName, packageVersion) {
      var data = {packageName: packageName, packageVersion: packageVersion};
      this.props.setWizardData(data);
      this.props.markStepAsFinished();
    }
    render() {
      return (
        <div>
          <PackagesList 
            filterValue={this.props.filterValue}
            wizardData={this.props.wizardData}
            setWizardData={this.setWizardData}/>
        </div>
      );
    }
  }
  return WizardStep1;
});
