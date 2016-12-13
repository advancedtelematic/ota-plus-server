define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      HomePageHeader = require('es6!./home-page-header'),
      LastCreatedDevices = require('es6!./last-created-devices'),
      LastUploadedPackages = require('es6!./last-uploaded-packages'),
      OngoingDraftCampaigns = require('es6!./ongoing-draft-campaigns'),
      LastRunningCampaigns = require('es6!./last-running-campaigns'),
      NewDevice = require('es6!../devices/new-device'),
      NewPackage = require('es6!../packages/add-package'),
      NewCampaign = require('es6!../newcampaigns/campaign-create'),
      CampaignWizard = require('es6!../newcampaigns/wizard/wizard');

  class HomePage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        firstLineBoxesBodyHeight: 300,
        secondLineBoxesBodyHeight: 300,
        isNewDeviceModalShown: false,
        isNewPackageModalShown: false,
        isNewCampaignModalShown: false,
        isCampaignWizardShown: false,
        campaignUUID: null
      };
      this.setElementsSize = this.setElementsSize.bind(this);
      this.openNewDeviceModal = this.openNewDeviceModal.bind(this);
      this.closeNewDeviceModal = this.closeNewDeviceModal.bind(this);
      this.openNewPackageModal = this.openNewPackageModal.bind(this);
      this.closeNewPackageModal = this.closeNewPackageModal.bind(this);
      this.openNewCampaignModal = this.openNewCampaignModal.bind(this);
      this.closeNewCampaignModal = this.closeNewCampaignModal.bind(this);
      this.openCampaignWizard = this.openCampaignWizard.bind(this);
      this.closeCampaignWizard = this.closeCampaignWizard.bind(this);
      this.configureCampaign = this.configureCampaign.bind(this);
    }
    componentDidMount() {
      this.setElementsSize();
      window.addEventListener("resize", this.setElementsSize);
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setElementsSize);
    }
    setElementsSize() {
      var wrapperHeight = $('.wrapper').height();
      var headerHeight = $('.grey-header').outerHeight();
      var firstLineBoxesPadding = $('.first-line .home-box').outerHeight() - $('.first-line .home-box').height();
      var secondLineBoxesPadding = $('.second-line .home-box').outerHeight() - $('.second-line .home-box').height();
      var panelHeadingHeight = $('.panel-heading').outerHeight();
      var heightAvailableForBoxesBody = wrapperHeight - headerHeight - firstLineBoxesPadding - secondLineBoxesPadding - 2 * panelHeadingHeight;
      var firstLineBoxesBodyHeight = 0.6 * heightAvailableForBoxesBody;
      var secondLineBoxesBodyHeight = heightAvailableForBoxesBody - firstLineBoxesBodyHeight;
      this.setState({
        firstLineBoxesBodyHeight: firstLineBoxesBodyHeight,
        secondLineBoxesBodyHeight: secondLineBoxesBodyHeight
      });
    }
    openNewDeviceModal() {
      this.setState({isNewDeviceModalShown: true});
    }
    closeNewDeviceModal() {
      this.setState({isNewDeviceModalShown: false});
    }
    openNewPackageModal() {
      this.setState({isNewPackageModalShown: true});
    }
    closeNewPackageModal() {
      this.setState({isNewPackageModalShown: false});
    }
    openNewCampaignModal() {
      this.setState({isNewCampaignModalShown: true});
    }
    closeNewCampaignModal() {
      this.setState({isNewCampaignModalShown: false});
    }
    openCampaignWizard(campaignUUID, ifRefreshData = false) {
      if(ifRefreshData) {
        setTimeout(function() {
          SotaDispatcher.dispatch({actionType: 'get-campaigns'});
        }, 1);
      }
      this.setState({
        isNewCampaignModalShown: false,
        isCampaignWizardShown: true,
        campaignUUID: campaignUUID
      });
    }
    closeCampaignWizard(ifRefreshData = false) {
      if(ifRefreshData) {
        setTimeout(function() {
          SotaDispatcher.dispatch({actionType: 'get-campaigns'});
        }, 1);
      }
      this.setState({
        isCampaignWizardShown: false
      });
    }
    configureCampaign(campaignUUID, e) {
      e.preventDefault();
      this.openCampaignWizard(campaignUUID);
    }
    render() {
      return (
        <div>
          <HomePageHeader /> 
          <div className="first-line">
            <div id="box-last-created-devices" className="home-box">
              <div className="panel panel-ats panel-ats-light">
                <div className="panel-heading">
                  <div className="panel-heading-left">
                    Last created devices
                  </div>
                </div>
                <div className="panel-body">
                  <LastCreatedDevices 
                    listHeight={this.state.firstLineBoxesBodyHeight}
                    openNewDeviceModal={this.openNewDeviceModal}/>
                </div>
              </div>
            </div>
            <div id="box-last-uploaded-packages" className="home-box">
              <div className="panel panel-ats panel-ats-light">
                <div className="panel-heading">
                  <div className="panel-heading-left">
                    Last uploaded packages
                  </div>
                </div>
                <div className="panel-body">
                  <LastUploadedPackages 
                    listHeight={this.state.firstLineBoxesBodyHeight}
                    openNewPackageModal={this.openNewPackageModal}/>
                </div>
              </div>
            </div>
            <div id="box-ongoing-draft-campaigns" className="home-box">
              <div className="panel panel-ats panel-ats-light">
                <div className="panel-heading">
                  <div className="panel-heading-left">
                    Ongoing draft campaigns
                  </div>
                </div>
                <div className="panel-body">
                  <OngoingDraftCampaigns 
                    listHeight={this.state.firstLineBoxesBodyHeight}
                    openNewCampaignModal={this.openNewCampaignModal}
                    configureCampaign={this.configureCampaign}/>
                </div>
              </div>
            </div>
          </div>
          <div className="second-line">
            <div id="box-last-running-campaigns" className="home-box">
              <div className="panel panel-ats panel-ats-light">
                <div className="panel-heading">
                  <div className="panel-heading-left">
                    Last running campaigns progress
                  </div>
                </div>
                <div className="panel-body">
                  <LastRunningCampaigns 
                    listHeight={this.state.secondLineBoxesBodyHeight}/>
                </div>
              </div>
            </div>
          </div>
          
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isNewDeviceModalShown ?
              <NewDevice 
                selectedGroup={null}
                closeNewDeviceModal={this.closeNewDeviceModal}/>
            : undefined}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isNewPackageModalShown ?
              <NewPackage
                files={null}
                closeForm={this.closeNewPackageModal}
                key="add-package"/>
            : undefined}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isNewCampaignModalShown ?
              <NewCampaign 
                closeModal={this.closeNewCampaignModal}
                openWizard={this.openCampaignWizard}/>
            : null}
            {this.state.isCampaignWizardShown ?
              <CampaignWizard 
                campaignUUID={this.state.campaignUUID}
                closeWizard={this.closeCampaignWizard}/>
            : null}
          </VelocityTransitionGroup>
        </div>
      );
    }
  };

  return HomePage;
});
