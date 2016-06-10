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
      ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
      jQuery = require('jquery'),
      Bootstrap = require('bootstrap'),
      SotaDispatcher = require('sota-dispatcher')
      SizeVerifier = require('../js/verify');
      
  /* Components*/
  var Nav = require('components/nav'),
      Translate = require('components/translation/translate'),
      Devices = require('components/devices/devices'),
      DeviceDetails = require('components/devices/device-details'),
      Packages = require('components/packages/packages'),
      NewDevice = require('components/devices/new-device'),
      Modal = require('components/modal'),
      Profile = require('components/profile'),
      RightPanel = require('components/campaigns/right-panel'),
      NewCampaign = require('components/campaigns/new-campaign'),
      Campaigns = require('components/campaigns/campaigns');

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
        filterValue: '',
        showCampaignPanel: false,
        intervalId: null,
      }
      
      this.changeLanguage = this.changeLanguage.bind(this);
      this.changeFilter = this.changeFilter.bind(this);
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
    changeFilter(filter) {
      this.setState({filterValue: filter});  
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
          default:
          break;
        }
      }
   
      
      return (
        <div key={page} className={page}>
          <Nav currentLang={this.state.currentLang} changeLang={this.changeLanguage} changeFilter={this.changeFilter} filterValue={this.state.filterValue} showCampaignPanel={this.state.showCampaignPanel} toggleCampaignPanel={this.toggleCampaignPanel}/>
          <div className="page wrapper container-fluid">
            {React.cloneElement(this.props.children, {filterValue: this.state.filterValue, showCampaignPanel: this.state.showCampaignPanel, toggleCampaignPanel: this.toggleCampaignPanel})}
          </div>
        </div>
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
          <Route path="newdevice" component={Modal(NewDevice, {TitleVar: "newdevice"})}/>
        </Route>
        <Route path="devicedetails/:vin" component={wrapComponent(DeviceDetails, {Device: db.showDevice})}>
          <Route path="newcampaign" component={Modal(NewCampaign, {TitleVar: "newcampaign", modalId: 'modal-new-campaign'})}/>
        </Route>
        <Route name="packages" component={Packages}/>
        <Route name="profile" component={Profile}/>
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
