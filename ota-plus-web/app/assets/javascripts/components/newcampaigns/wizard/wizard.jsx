define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      SearchBar = require('es6!../../searchbar'),
      Loader = require('../../loader'),
      WizardStep1 = require('es6!./wizard-step-1'),
      WizardStep2 = require('es6!./wizard-step-2'),
      WizardStep3 = require('es6!./wizard-step-3'),
      WizardStep4 = require('es6!./wizard-step-4');

  class Wizard extends React.Component {
    constructor(props) {
      super(props);      
      this.state = {
        currentStepId: 0,
        wizardSteps: [
          {
            class: WizardStep1,
            title: 'Select Package',
            isFinished: false
          },
          {
            class: WizardStep2,
            title: 'Select Group(s)',
            isFinished: false
          },
          {
            class: WizardStep4,
            title: 'Summary',
            finishButtonLabel: 'Launch',
            isFinished: true
          },
        ],
        wizardData: null,
        filterValue: null
      };
      
      this.closeWizard = this.closeWizard.bind(this);
      this.isFirstStep = this.isFirstStep.bind(this);
      this.isLastStep = this.isLastStep.bind(this);
      this.prevStep = this.prevStep.bind(this);
      this.nextStep = this.nextStep.bind(this);
      this.jumpToStep = this.jumpToStep.bind(this);
      this.finish = this.finish.bind(this);
      this.handleResponse = this.handleResponse.bind(this);
      this.verifyIfPreviousStepsFinished = this.verifyIfPreviousStepsFinished.bind(this);
      this.markStepAsFinished = this.markStepAsFinished.bind(this);
      this.markStepAsNotFinished = this.markStepAsNotFinished.bind(this);
      this.setWizardData = this.setWizardData.bind(this);
      this.changeFilter = this.changeFilter.bind(this);
      this.setData = this.setData.bind(this);
      
      db.campaign.addWatch("poll-campaign", _.bind(this.setData, this, null));
      db.postStatus.addWatch("poll-launch-campaign", _.bind(this.handleResponse, this, null));
    }
    componentDidMount() {
      SotaDispatcher.dispatch({actionType: 'get-campaign', uuid: this.props.campaignUUID});
    }
    componentWillUnmount() {
      db.searchablePackages.reset();
      db.groups.reset();
      db.campaign.reset();
      db.campaign.removeWatch("poll-campaign");
      db.postStatus.removeWatch("poll-launch-campaign");
    }
    closeWizard(e) {
      e.preventDefault();
      this.props.closeWizard();
    }
    prevStep() {
      if(this.state.currentStepId != 0)
        this.setState({currentStepId: this.state.currentStepId - 1});
    }
    nextStep() {
      if(this.verifyIfPreviousStepsFinished(this.state.currentStepId) && this.state.currentStepId != this.state.wizardSteps.length - 1)
        this.setState({currentStepId: this.state.currentStepId + 1});
    }
    jumpToStep(stepId, e) {
      e.preventDefault();
      
      if(stepId < this.state.currentStepId || this.verifyIfPreviousStepsFinished(stepId - 1))
        this.setState({currentStepId: stepId});
    }
    isFirstStep() {
      return this.state.currentStepId == 0;
    }
    isLastStep() {
      return this.state.currentStepId == this.state.wizardSteps.length - 1;
    }
    finish() {
      SotaDispatcher.dispatch({
        actionType: 'launch-campaign',
        uuid: db.campaign.deref().meta.id,
      });
    }
    handleResponse() {
      var postStatus = !_.isUndefined(db.postStatus.deref()) ? db.postStatus.deref()['launch-campaign'] : undefined;
      if(!_.isUndefined(postStatus)) {
        if(postStatus.status === 'success') {
          db.postStatus.removeWatch("poll-launch-campaign");
          delete postStatus['launch-campaign'];
          db.postStatus.reset(postStatus);
          this.context.history.pushState(null, `campaigndetails/${db.campaign.deref().meta.id}`);
        }
      }
    }
    verifyIfPreviousStepsFinished(stepId) {
      if(_.find(this.state.wizardSteps, function(step, index) {
        return index <= stepId && step.isFinished === false;
      }))
        return false;
        
      return true;
    }
    setWizardData(data) {
      var wizardData = this.state.wizardData || [];
      wizardData[this.state.currentStepId] = data;
      this.setState({wizardData: wizardData});
    }
    markStepAsFinished() {
      var wizardSteps = this.state.wizardSteps;
      wizardSteps[this.state.currentStepId].isFinished = true;
      this.setState({wizardSteps: wizardSteps});
    }
    markStepAsNotFinished() {
      var wizardSteps = this.state.wizardSteps;
      wizardSteps[this.state.currentStepId].isFinished = false;
      this.setState({wizardSteps: wizardSteps});
    }
    changeFilter(filterValue) {
      this.setState({filterValue: filterValue});
    }
    setData() {
      var campaign = db.campaign.deref();
      if(!_.isUndefined(campaign)) {
        var wizardData = [];
        var wizardSteps = this.state.wizardSteps;
        if(campaign.packageId) {
          wizardSteps[0].isFinished = true;
          wizardData[0] = {packageName: campaign.packageId.name, packageVersion: campaign.packageId.version};
        }
        
        if(Object.keys(campaign.groups).length) {
          wizardData[1] = {chosenGroups: []};
          _.each(campaign.groups, function(group) {
            wizardData[1].chosenGroups.push(group.group);
          });
          wizardSteps[1].isFinished = true;
        }
                
        this.setState({wizardData: wizardData});
        this.setState({wizardSteps: wizardSteps});
      }
    }
    render() {
      var currentStep = this.state.wizardSteps[this.state.currentStepId];
      var stepsLine = _.map(this.state.wizardSteps, function(step, index) {
        return (
          <div className={"col-xs-3 bs-wizard-step" + (this.state.currentStepId == index ? " active" : "")} key={'wizard-step-' + index}>
            <div className="progress"><div className="progress-bar"></div></div>
            <a href="#" className="bs-wizard-dot" onClick={this.jumpToStep.bind(this, index)}>{index+1}</a>
            <div className="text-center bs-wizard-stepnum">{step.title}</div>
          </div>
        );
      }, this);
      return (
        <div id="modal-campaign-create" className="myModal" role="dialog">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{currentStep.title}</h4>
                {this.state.currentStepId < 2 ? 
                  <SearchBar 
                    class="search-bar pull-left" 
                    inputId="search-groups-input" 
                    changeFilter={this.changeFilter} />
                : null}
              </div>
              <div className={"modal-body" + (this.state.currentStepId < 2 ? " nopadding" : "")}>
                {!_.isUndefined(db.campaign.deref()) ? 
                  React.createElement(currentStep.class, {
                    campaign: db.campaign.deref(),
                    setWizardData: this.setWizardData,
                    wizardData: this.state.wizardData,
                    markStepAsFinished: this.markStepAsFinished,
                    markStepAsNotFinished: this.markStepAsNotFinished,
                    filterValue: this.state.filterValue,
                  })
                : undefined}
                {_.isUndefined(db.campaign.deref()) ? 
                  <Loader />
                : undefined}
              </div>
              <div className="modal-footer">
                <div className="col-xs-2">
                  <a href="#" className="darkgrey margin-top-20 pull-left" onClick={this.closeWizard}>Save & Close</a>
                </div>
                <div className="col-xs-7">
                  <div className="pull-left width-100">
                    <div className="row bs-wizard">
                      {stepsLine}
                    </div>
                  </div>
                </div>
                <div className="col-xs-3">
                  {this.isLastStep() ? 
                    <button className="btn btn-red" onClick={this.finish} disabled={currentStep.isFinished ? "" : "disabled"}>Launch</button>
                  :
                    <button className="btn btn-confirm" onClick={this.nextStep} disabled={currentStep.isFinished ? "" : "disabled"}>Next</button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
  
  Wizard.contextTypes = {
    history: React.PropTypes.object.isRequired,
    strings: React.PropTypes.object.isRequired,
  };
  
  return Wizard;
});
