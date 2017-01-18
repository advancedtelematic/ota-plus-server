define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      Profile = require('./user/profile'),
      VelocityComponent = require('mixins/velocity/velocity-component'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');

  class Nav extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        uploadProgress: undefined
      };
      this.toggleCampaignPanel = this.toggleCampaignPanel.bind(this);
      this.openUploadModal = this.openUploadModal.bind(this);
      db.user.addWatch("poll-user-nav", _.bind(this.forceUpdate, this, null));
      db.impactAnalysis.addWatch("poll-impact-analysis-nav", _.bind(this.forceUpdate, this, null));
    }
    componentDidMount() {
      SotaDispatcher.dispatch({actionType: 'get-user'});
      $(".dropdown-profile").click(function(e) {
        if(e.target.tagName.toLowerCase() !== 'a') {
          e.stopPropagation();
        }
      });
    }
    componentWillUnmount() {
      db.user.removeWatch("poll-user-nav");
      db.impactAnalysis.removeWatch("poll-impact-analysis-nav");
    }
    toggleCampaignPanel(e) {
      e.preventDefault();
      this.props.toggleCampaignPanel();
    }
    openUploadModal(e) {
      e.preventDefault();
      this.props.openUploadModal();
    }
    render() {
      var campaignsData = JSON.parse(localStorage.getItem('campaignsData'));
      var impactAnalysis = db.impactAnalysis.deref();
      var user = db.user.deref();
      var impactedDevices = undefined;
      var barOptions = {
        strokeWidth: 16,
        easing: 'easeInOut',
        color: '#C5E5E2',
        trailColor: '#eee',
        trailWidth: 16,
        svgStyle: null
      };
      
      if(!_.isUndefined(impactAnalysis)) {
        impactedDevices = {};
                        
        _.each(impactAnalysis, function(impact, deviceUUID) {
          _.each(impact, function(pack) {
            impactedDevices[deviceUUID] = {
              uuid: deviceUUID
            };
          });          
        });
      }
      
      var storedThemeMode = localStorage.getItem('themeMode');
      var theme = 'atsgarage';
      switch(storedThemeMode) {
        case 'otaplus': 
          theme = 'otaplus';
        break;
        default:
        break;
      }
      
      return (
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <Link to="/" className="navbar-brand"><img src={"/assets/img/" + theme + ".png"} id="logo" alt=""/></Link>
            </div>
            <div id="navbar" className="pull-left">
              <ul className="nav navbar-nav">
                <li><Link to="/devices" activeClassName="active" id="link-devices">Devices</Link></li>
                <li><Link to="/packages" activeClassName="active" id="link-packages">Packages</Link></li>
                <li><Link to="/campaigns" activeClassName="active" id="link-campaigns">Campaigns</Link></li>
                <li>
                  <Link to="/impactanalysis" activeClassName="active" id="link-impactanalysis">
                    {_.isUndefined(impactedDevices) ? 
                      <span>
                        <i className="fa fa-square-o fa-spin"></i> &nbsp;
                      </span>
                    : 
                      !_.isEmpty(impactedDevices) ?
                        <span className="badge">
                          {Object.keys(impactedDevices).length}
                        </span>
                      :
                        null
                    }
                    Impact analysis
                  </Link>
                </li>
                <li><Link to="/treehub" activeClassName="active" id="link-treehub">TreeHub</Link></li>
                {this.props.hasBetaAccess ?
                  <li><Link to="/provisioning" activeClassName="active" id="link-provisioning">Provisioning</Link></li>
                : null}
              </ul>
            </div>
            <ul className="right-nav pull-right">
              {campaignsData !== null && campaignsData.length > 0 ?
                <li>
                  <a href="#" className="btn-campaigns" onClick={this.toggleCampaignPanel}>
                    <img src="/assets/img/icons/wireless.png" className="icon-campaigns" alt=""/>
                  </a>
                </li>
              : null}
              <li className="text-link">
                <a href="mailto:support@atsgarage.com">NEED SUPPORT?</a>
              </li>
              <li className="dropdown" id="menuLogin">
                <a className="dropdown-toggle btn-profile" href="#" data-toggle="dropdown">
                  {!_.isUndefined(user) && user.picture ? 
                    <img src={user.picture} className="profile-icon" alt="" id="icon-profile"/> 
                  :
                    <img src="/assets/img/icons/profile_icon_big.png" className="profile-icon" alt="" />
                  }
                  &nbsp; <i className="fa fa-caret-down"></i>
                </a>
                <Profile logout={this.props.logout}/>
              </li>
            </ul>
          </div>
        </nav>
      );
    }
  }

  return Nav;
});
