define(function(require) {
  /* Main packages */
  var React = require('react'),
      ReactDOM = require('react-dom'),
      ReactRouter = require('react-router'),
      Router = ReactRouter.Router,
      Route = ReactRouter.Route,
      Link = ReactRouter.Link,
      IndexRoute = ReactRouter.IndexRoute,
      HashHistory = ReactRouter.hashHistory,
      ReactI18next = require('reactI18next'),
      I18nextProvider = ReactI18next.I18nextProvider,
      i18n = require('./i18n'),
      db = require('stores/db'),
      Handler = require('handlers/handler'),
      VelocityUI = require('velocity-ui'),
      VelocityHelpers = require('mixins/velocity/velocity-helpers'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      VelocityComponent = require('mixins/velocity/velocity-component'),
      jQuery = require('jquery'),
      Bootstrap = require('bootstrap'),
      SotaDispatcher = require('sota-dispatcher'),
      SizeVerifier = require('../js/verify'),
      WebsocketHandler = require('handlers/websocket');

  /* Components*/
  var Nav = require('components/nav'),
      DevicesPage = require('components/devices-page/devices-page'),
      DeviceDetails = require('components/devices/device'),
      ProductionDeviceDetails = require('components/devices/production-device-details'),
      Packages = require('components/packages-page/packages'),
      Modal = require('components/modal'),
      ImpactAnalysis = require('components/devices/impact-analysis'),
      Profile = require('components/profile'),
      RightPanel = require('components/campaigns/right-panel'),
      NewCampaign = require('components/campaigns/new-campaign'),
      Campaigns = require('components/campaigns/campaigns'),
      TestSettings = require('components/test-settings'),
      EditProfile = require('components/user/edit-profile'),
      ImpactAnalysisPage = require('components/impactanalysis/impact-analysis-page'),
      UploadModal = require('components/packages/upload-modal'),
      Campaigns = require('components/newcampaigns/campaigns'),
      CampaignDetails = require('components/newcampaigns/campaign-details'),
      ClientApps = require('components/clientapps/client-apps'),
      TreeHub = require('components/treehub/treehub'),
      Provisioning = require('components/provisioning/provisioning'),
      HomePage = require('components/homepage/home-page');

  class App extends React.Component {
    constructor(props) {
      super(props);
      
      var path = this.props.location.pathname.toLowerCase().split('/');
      var isHomePage = path[0] == '' && path[1] == '' ? true : false;

      this.state = {
        showCampaignPanel: false,
        intervalId: null,
        hideAnimationUp: false,
        hideAnimationDown: true,
      }

      this.toggleCampaignPanel = this.toggleCampaignPanel.bind(this);
      this.handleLogout = this.handleLogout.bind(this);
      this.logout = this.logout.bind(this);
      this.openDoor = this.openDoor.bind(this);
      
      db.logout.addWatch("watch-logout", _.bind(this.handleLogout, this, null));
      db.hasBetaAccess.addWatch("has-beta-access", _.bind(this.forceUpdate, this, null));
      SotaDispatcher.dispatch({actionType: 'impact-analysis'});
      WebsocketHandler.init();      
    }
    toggleCampaignPanel() {
      this.setState({
        showCampaignPanel: !this.state.showCampaignPanel
      });
    }
    handleLogout() {
      if(!_.isUndefined(db.logout.deref()) && db.logout.deref()) {
        window.location.replace(logoutUrl);
      }
    }
    logout(e) {
      e.preventDefault();
      var that = this;
      setTimeout(function() {
        that.setState({hideAnimationDown: !that.state.hideAnimationDown});
      }, 200);
    }
    openDoor() {
      if(!_.isUndefined(db.devices.deref()) && !_.isUndefined(db.searchableDevices.deref())) {
        var that = this;
        db.devices.removeWatch("watch-devices");
        db.searchableDevices.removeWatch("watch-searchable-devices");
        setTimeout(function() {
          that.setState({hideAnimationUp: !that.state.hideAnimationUp});
        }, 300);
      }
    }
    componentDidMount() {
      var that = this;
      
      jQuery(function () {
        jQuery('body').verify({verifyMinWidth: 1280, verifyMinHeight: 0});
      });
      
      var intervalId = setInterval(function() {
        var campaignsData = JSON.parse(localStorage.getItem('campaignsData'));
        if(campaignsData !== null && campaignsData.length > 0) {
          var newCampaignsData = [];

          _.map(campaignsData, function(campaign, i) {
            newCampaignsData[i] = campaign;
            if(newCampaignsData[i].status == 'running') {
              if(newCampaignsData[i].progress < 100) {
                newCampaignsData[i].progress = newCampaignsData[i].progress + 1;
              } else {
                newCampaignsData[i].status = 'finished';
              }
            }
          });

          localStorage.setItem('campaignsData', JSON.stringify(newCampaignsData));
        }
      }, 5000);
      
      this.setState({
        intervalId: intervalId
      });
    }
    componentWillUnmount() {
      WebsocketHandler.destroy();
      clearInterval(this.state.intervalId);
    }
    render() {
      var Animations = {
        up: VelocityHelpers.registerEffect({
          defaultDuration: 800,
          calls: [
            [{
              translateY: '-100%'
            }]
          ],
        }),
        down: VelocityHelpers.registerEffect({
          defaultDuration: 200,
          calls: [
            [{
              translateY: '100%'
            }]
          ],
        }),
      };
            
      var path = this.context.location.pathname.toLowerCase().split('/');
      var key = path[1] !== undefined ? path[1] : 'page';
      var page = '';

      if(path[1] !== undefined) {
        switch(path[1]) {
          case '': 
            page = 'page-home'; break;
          case 'devices':
            page = 'page-devices'; break;
          case 'devicedetails':
            page = 'page-device-details'; break;
          case 'productiondevicedetails':
            page = 'page-device-details'; break;
          case 'packages':
            page = 'page-packages'; break;
          case 'impactanalysis':
            page = 'page-impact-analysis'; break;
          case 'campaigns':
            page = 'page-campaigns'; break;
          case 'clientapps':
            page = 'page-client-apps'; break;
          case 'treehub':
            page = 'page-treehub'; break;
          case 'provisioning':
            page = 'page-provisioning'; break;
          default:
          break;
        }
      }

      return (
        <div>
          <VelocityComponent animation={!this.state.hideAnimationUp ? Animations.up : null}>
            <div className="door">
              {this.state.hideAnimationUp ? 
                <div className="loader darkgrey text-center">
                  <div className="loading-text">Ready!</div>
                </div>
              : null}
            </div>
          </VelocityComponent>
          <VelocityTransitionGroup enter={{animation: Animations.down, complete: function() {window.location.href = logoutUrl}}}>
            {!this.state.hideAnimationDown ? 
              <div className="door door-up">
                <i className="fa fa-square-o fa-spin fa-2x loader darkgrey"></i>
              </div>
            : null}
          </VelocityTransitionGroup>
          <div key={key} className={page}>
            <Nav 
              showCampaignPanel={this.state.showCampaignPanel} 
              toggleCampaignPanel={this.toggleCampaignPanel} 
              logout={this.logout}
              hasBetaAccess={db.hasBetaAccess.deref()}/>
            <div className="page wrapper">
              {React.cloneElement(this.props.children, {showCampaignPanel: this.state.showCampaignPanel, toggleCampaignPanel: this.toggleCampaignPanel, hasBetaAccess: db.hasBetaAccess.deref()})}
            </div>
            
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              <UploadModal />
            </VelocityTransitionGroup>
          </div>
        </div>
      );
    }
  };

  App.contextTypes = {
    location: React.PropTypes.object,
    router: React.PropTypes.object,
  };

  var routes = (
    <Route component={App} path="/" ignoreScrollBehavior={true}>
      <Route component={RightPanel}>
        <IndexRoute component={HomePage}/>
        <Route path="/" component={HomePage}/>
        <Route path="devices" component={DevicesPage}/>
        <Route path="devicedetails/:id" component={DeviceDetails}>
          <Route path="impactanalysis/:count" component={Modal(ImpactAnalysis, {TitleVar: "impactanalysis", modalId: 'modal-impact-analysis'})}/>
          <Route path="newcampaign" component={Modal(NewCampaign, {TitleVar: "newcampaign", modalId: 'modal-new-campaign'})}/>
          <Route path=":action/:vin2" />
        </Route>
        <Route path="productiondevicedetails/:id" component={ProductionDeviceDetails}/>
        <Route path="packages(/:highlightedName)" component={Packages}/>
        <Route path="testsettings" component={TestSettings}/>
        <Route path="editprofile" component={EditProfile}/>
        <Route path="impactanalysis" component={ImpactAnalysisPage}/>
        <Route path="impactanalysis" component={ImpactAnalysisPage}/>
        <Route path="campaigns" component={Campaigns}/>
        <Route path="campaigndetails/:id" component={CampaignDetails} />
        <Route path="clientapps/f708f064faaf32a43e4d3c784e6af9eac6d9b20e0da02616378748834f5a37ee" component={ClientApps} />
        <Route path="treehub" component={TreeHub} />
        <Route path="provisioning" component={Provisioning} />
      </Route>
    </Route>
  );

  return {
    run() {
      ReactDOM.render(
        <I18nextProvider i18n={i18n}>
          <Router history={HashHistory}>
            {routes}
          </Router>
        </I18nextProvider>,
        document.getElementById('app')
      );

      SotaDispatcher.dispatch({
        actionType: 'initialize'
      });
    }
  };
});
