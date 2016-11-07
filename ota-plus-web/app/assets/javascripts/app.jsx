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
  var Nav = require('es6!components/nav'),
      Translate = require('es6!components/translation/translate'),
      Devices = require('es6!components/devices/devices'),
      DeviceDetails = require('es6!components/devices/device-details'),
      ProductionDeviceDetails = require('es6!components/devices/production-device-details'),
      Packages = require('es6!components/packages-page/packages'),
      Modal = require('es6!components/modal'),
      ImpactAnalysis = require('es6!components/devices/impact-analysis'),
      Profile = require('es6!components/profile'),
      RightPanel = require('es6!components/campaigns/right-panel'),
      NewCampaign = require('es6!components/campaigns/new-campaign'),
      Campaigns = require('es6!components/campaigns/campaigns'),
      TestSettings = require('es6!components/test-settings'),
      EditProfile = require('es6!components/user/edit-profile'),
      ImpactAnalysisPage = require('es6!components/impactanalysis/impact-analysis-page'),
      UploadModal = require('es6!components/packages/upload-modal'),
      Campaigns = require('es6!components/newcampaigns/campaigns'),
      CampaignDetails = require('es6!components/newcampaigns/campaign-details'),
      ClientApps = require('es6!components/clientapps/client-apps');

  const languages = {
    en: 'en'
  };

  class App extends React.Component {
    constructor(props) {
      super(props);
      var currentLang = 'en';
      if(localStorage.getItem('currentLang') && localStorage.getItem('currentLang') in languages) {
        currentLang = localStorage.getItem('currentLang');
      } else {
        var browserLang = (navigator.language || navigator.userLanguage);
        if(browserLang && browserLang in languages) {
          currentLang = browserLang;
        }
      }
      
      var path = this.props.location.pathname.toLowerCase().split('/');
      var isHomePage = path[0] == '' && path[1] == '' ? true : false;

      this.state = {
        currentLang: currentLang,
        showCampaignPanel: false,
        intervalId: null,
        hideAnimationUp: isHomePage,
        hideAnimationDown: true,
      }

      this.changeLanguage = this.changeLanguage.bind(this);
      this.toggleCampaignPanel = this.toggleCampaignPanel.bind(this);
      this.handleLogout = this.handleLogout.bind(this);
      this.logout = this.logout.bind(this);
      this.openDoor = this.openDoor.bind(this);
      
      if(isHomePage) {
        db.devices.addWatch("watch-devices", _.bind(this.openDoor, this, null));
        db.searchableDevices.addWatch("watch-searchable-devices", _.bind(this.openDoor, this, null));
      }
      db.logout.addWatch("watch-logout", _.bind(this.handleLogout, this, null));
      SotaDispatcher.dispatch({actionType: 'impact-analysis'});
      WebsocketHandler.init();      
    }
    changeLanguage(value) {
      localStorage.setItem('currentLang', value);
      this.setState({
        currentLang: value
      });
    }
    toggleCampaignPanel() {
      this.setState({
        showCampaignPanel: !this.state.showCampaignPanel
      });
    }
    handleLogout() {
      if(!_.isUndefined(db.logout.deref()) && db.logout.deref()) {
        var that = this;
        setTimeout(function() {
          that.setState({hideAnimationDown: !that.state.hideAnimationDown});
        }, 200);
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
        jQuery('body').verify({verifyMinWidth: 1366, verifyMinHeight: 0});
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
            page = 'page-home';
          break;
          case 'devicedetails':
            page = 'page-device-details';
          break;
          case 'productiondevicedetails':
            page = 'page-device-details';
          break;
          case 'packages':
            page = 'page-packages';
          break;
          case 'impactanalysis':
            page = 'page-impact-analysis';
          break;
          case 'campaigns':
            page = 'page-campaigns';
          break;
          case 'clientapps':
            page = 'page-client-apps';
          break;
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
              currentLang={this.state.currentLang} 
              changeLang={this.changeLanguage} 
              showCampaignPanel={this.state.showCampaignPanel} 
              toggleCampaignPanel={this.toggleCampaignPanel} 
              logout={this.logout}/>
            <div className="page wrapper">
              {React.cloneElement(this.props.children, {showCampaignPanel: this.state.showCampaignPanel, toggleCampaignPanel: this.toggleCampaignPanel})}
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

  var wrapComponent = function wrapComponent(Component, props) {
    return class wrapComponentClass extends React.Component {
      render() {
        return (
          <Component {...this.props} {...props} params={this.props.params}/>
        )
      }
    }
  };

  var routes = (
    <Route component={Translate(App)} path="/" ignoreScrollBehavior={true}>
      <Route component={RightPanel}>
        <IndexRoute component={Devices}/>
        <Route path="/" component={Devices}/>
        <Route path="devicedetails/:id" component={DeviceDetails}>
          <Route path="impactanalysis/:count" component={Modal(ImpactAnalysis, {TitleVar: "impactanalysis", modalId: 'modal-impact-analysis'})}/>
          <Route path="newcampaign" component={Modal(NewCampaign, {TitleVar: "newcampaign", modalId: 'modal-new-campaign'})}/>
          <Route path=":action/:vin2" />
        </Route>
        <Route path="productiondevicedetails/:id" component={ProductionDeviceDetails}/>
        <Route path="packages" component={Packages}/>
        <Route path="testsettings" component={TestSettings}/>
        <Route path="editprofile" component={EditProfile}/>
        <Route path="impactanalysis" component={ImpactAnalysisPage}/>
        <Route path="campaigns" component={Campaigns}/>
        <Route path="campaigndetails/:id" component={CampaignDetails} />
        <Route path="clientapps/f708f064faaf32a43e4d3c784e6af9eac6d9b20e0da02616378748834f5a37ee" component={ClientApps} />
      </Route>
    </Route>
  );

  return {
    run() {
      ReactDOM.render(
        <Router history={HashHistory}>
          {routes}
        </Router>,
        document.getElementById('app')
      );

      SotaDispatcher.dispatch({
        actionType: 'initialize'
      });
    }
  };
});
