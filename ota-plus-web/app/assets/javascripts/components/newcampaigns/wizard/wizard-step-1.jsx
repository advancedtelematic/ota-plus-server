define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      PackagesList = require('./wizard-step-1/packages-list');

  class WizardStep1 extends React.Component {
    constructor(props) {
      super(props);
      this.setWizardData = this.setWizardData.bind(this);
    }
    setWizardData(packageName, packageVersion) {
      SotaDispatcher.dispatch({
        actionType: 'set-package-for-campaign',
        uuid: this.props.campaignUUID,
        data: {name: packageName, version: packageVersion}
      });
      this.props.setWizardData({packageName: packageName, packageVersion: packageVersion});
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
