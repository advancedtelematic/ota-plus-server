define(function(require) {
  /* Main packages */
  var React = require('react'),
      ReactDOM = require('react-dom'),
      Router = require('react-router'),
      Route = Router.Route,
      RouteHandler = Router.RouteHandler,
      DefaultRoute = Router.DefaultRoute,
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
      }
      
      this.changeLanguage = this.changeLanguage.bind(this);
      this.changeFilter = this.changeFilter.bind(this);
      this.toggleCampaignPanel = this.toggleCampaignPanel.bind(this);
    }
    componentDidMount() {
      jQuery(function () {
        jQuery('body').verify({verifyMinWidth: 1366, verifyMinHeight: 100});
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
    render() {
      var params = this.context.router.getCurrentParams();  
      var currentRoutes = this.context.router.getCurrentRoutes();
      var page = (currentRoutes[currentRoutes.length - 1]['name']) ? 'page-' + currentRoutes[currentRoutes.length - 1]['name'].split(/(?=[A-Z])/).join("-").toLowerCase() : 'page-home';
            
      if(page == 'page-new-campaign' || page == 'page-campaigns') page += ' page-device-details';
       
      return (
        <div key={page} className={page}>
          <Nav currentLang={this.state.currentLang} changeLang={this.changeLanguage} changeFilter={this.changeFilter} filterValue={this.state.filterValue} showCampaignPanel={this.state.showCampaignPanel} toggleCampaignPanel={this.toggleCampaignPanel}/>
          <div className="page wrapper container-fluid">
            <RouteHandler {...params} filterValue={this.state.filterValue} showCampaignPanel={this.state.showCampaignPanel} toggleCampaignPanel={this.toggleCampaignPanel} />
          </div>
        </div>
      );
    }
  };

  App.contextTypes = {
    router: React.PropTypes.func
  };
  
  

  var wrapComponent = function wrapComponent(Component, props) {
    return class wrapComponentClass extends React.Component {
      render() {
        return (
          <Component {...props} params={this.props.params}/>
        )
      }
    }
  };

  var routes = (
    <Route handler={Translate(App)} path="/" ignoreScrollBehavior={true}>
      <Route handler={RightPanel}>
        <DefaultRoute handler={Devices}/>
        <Route path="/" handler={Devices}>
          <Route name="newDevice" path="/devices/new" handler={Modal(NewDevice, {TitleVar: "newdevice"})}/>
        </Route>
        <Route name="deviceDetails" path="/devices/:vin" handler={wrapComponent(DeviceDetails, {Device: db.showDevice})}>
          <Route name="new-campaign" path="new-campaign" handler={Modal(NewCampaign, {TitleVar: "newcampaign", modalId: 'modal-new-campaign'})}/>
        </Route>
        <Route name="packages" handler={Packages}/>
        <Route name="profile" handler={Profile}/>
      </Route>
    </Route>
  );

  return {
    run() {
      Router.run(routes, function (Handler) {
        ReactDOM.render(<Handler />, document.getElementById('app'));
      });
      SotaDispatcher.dispatch({
        actionType: 'initialize'
      });
    }
  };
});
