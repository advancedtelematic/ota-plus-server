define(function(require) {
  var React = require('react'),
      GroupsList = require('./wizard-step-2/groups-list');

  class WizardStep2 extends React.Component {
    constructor(props) {
      super(props);
      this.setWizardData = this.setWizardData.bind(this);
    }
    setWizardData(chosenGroups) {
      var data = {chosenGroups: chosenGroups};
      this.props.setWizardData(data);
      if(chosenGroups.length)
        this.props.markStepAsFinished();
      else
        this.props.markStepAsNotFinished();
    }
    render() {
      return (
        <div>
          <GroupsList 
            filterValue={this.props.filterValue}
            wizardData={this.props.wizardData}
            setWizardData={this.setWizardData}/>
        </div>
      );
    }
  }
  return WizardStep2;
});
