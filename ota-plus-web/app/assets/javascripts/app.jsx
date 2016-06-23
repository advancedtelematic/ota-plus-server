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
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      jQuery = require('jquery'),
      Bootstrap = require('bootstrap'),
      SotaDispatcher = require('sota-dispatcher')
      SizeVerifier = require('../js/verify');
      
  /* Components*/
  var Nav = require('components/nav'),
      Translate = require('components/translation/translate'),
      Devices = require('components/devices/devices'),
      DeviceDetails = require('components/devices/device-details'),
      ProductionDeviceDetails = require('components/devices/production-device-details'),
      Packages = require('components/packages/packages'),
      NewDevice = require('components/devices/new-device'),
      Modal = require('components/modal'),
      ImpactAnalysis = require('components/devices/impact-analysis'),
      Profile = require('components/profile'),
      RightPanel = require('components/campaigns/right-panel'),
      NewCampaign = require('components/campaigns/new-campaign'),
      Campaigns = require('components/campaigns/campaigns'),
      TestSettings = require('components/test-settings');

  const languages = {
    en: 'en', 
    de: 'de', 
    jp: 'jp'
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
      
      this.state = {
        currentLang: currentLang,
        showCampaignPanel: false,
        intervalId: null,
      }
      
      this.changeLanguage = this.changeLanguage.bind(this);
      this.toggleCampaignPanel = this.toggleCampaignPanel.bind(this);
    }
    componentDidMount() {
      jQuery(function () {
        jQuery('body').verify({verifyMinWidth: 1366, verifyMinHeight: 0});
      });
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
    componentDidMount() {
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
      clearInterval(this.state.intervalId);
    }
    render() {
      var path = this.context.location.pathname.toLowerCase().split('/');
      var key = path[1] !== undefined ? path[1] : 'page';
      var page = '';
            
      if(path[1] !== undefined) {
        switch(path[1]) {
          case '':
            page = 'page-home';
          break;
          case 'newdevice': 
            page = 'page-home';
          break;
          case 'devicedetails': 
            page = 'page-device-details';
          break;
          case 'productiondevicedetails': 
            page = 'page-device-details';
          break;
          case 'testsettings':
            page = 'page-home';
          break;
          default:
          break;
        }
      }
   
      return (
        <VelocityTransitionGroup enter={{animation: "fadeIn"}} runOnMount={true}>
          <div key={key} className={page}>
            <Nav currentLang={this.state.currentLang} changeLang={this.changeLanguage} showCampaignPanel={this.state.showCampaignPanel} toggleCampaignPanel={this.toggleCampaignPanel}/>
            <div className="page wrapper">
              {React.cloneElement(this.props.children, {showCampaignPanel: this.state.showCampaignPanel, toggleCampaignPanel: this.toggleCampaignPanel})}
            </div>
          </div>
        </VelocityTransitionGroup>
      );
    }
  };

  App.contextTypes = {
    location: React.PropTypes.object,
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
        <Route path="/" component={Devices}>
          <Route path="newdevice" component={Modal(NewDevice, {TitleVar: "newdevice", modalId: 'modal-new-device'})}/>
        </Route>
        <Route path="devicedetails/:vin" component={wrapComponent(DeviceDetails, {Device: db.showDevice})}>
          <Route path="impactanalysis/:count" component={Modal(ImpactAnalysis, {TitleVar: "impactanalysis", modalId: 'modal-impact-analysis'})}/>
          <Route path="newcampaign" component={Modal(NewCampaign, {TitleVar: "newcampaign", modalId: 'modal-new-campaign'})}/>
          <Route path=":action/:vin2" />
        </Route>
        <Route path="productiondevicedetails/:vin" component={wrapComponent(ProductionDeviceDetails, {Device: db.showDevice})}/>
        <Route name="packages" component={Packages}/>
        <Route name="profile" component={Profile}/>
        <Route path="testsettings" component={TestSettings}/>
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
