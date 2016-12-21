define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      HomePageHeader = require('./home-page-header'),
      LastCreatedDevices = require('./last-created-devices'),
      LastUploadedPackages = require('./last-uploaded-packages'),
      OngoingDraftCampaigns = require('./ongoing-draft-campaigns'),
      LastRunningCampaigns = require('./last-running-campaigns'),
      NewDevice = require('../devices/new-device'),
      NewPackage = require('../packages/add-package'),
      NewCampaign = require('../newcampaigns/campaign-create'),
      CampaignWizard = require('../newcampaigns/wizard/wizard');

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
        actionCampaign: null
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
    openCampaignWizard(actionCampaign, ifRefreshData = false) {
      if(ifRefreshData) {
        setTimeout(function() {
          SotaDispatcher.dispatch({actionType: 'get-campaigns'});
        }, 1);
      }
      this.setState({
        isNewCampaignModalShown: false,
        isCampaignWizardShown: true,
        actionCampaign: actionCampaign
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
      this.openCampaignWizard({id: campaignUUID});
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
                campaignUUID={this.state.actionCampaign.id}
                closeWizard={this.closeCampaignWizard}/>
            : null}
          </VelocityTransitionGroup>
        </div>
      );
    }
  };
  
  HomePage.contextTypes = {
    location: React.PropTypes.object,
  };

  return HomePage;
});
