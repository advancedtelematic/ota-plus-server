define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      IndexLink = Router.IndexLink,
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      LanguageSelector = require('es6!./translation/language-selector'),
      Translate = require('./translation/translate'),
      Profile = require('es6!./user/profile'),
      VelocityComponent = require('mixins/velocity/velocity-component'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');;

  class Nav extends React.Component {
    constructor(props) {
      super(props);
      this.toggleCampaignPanel = this.toggleCampaignPanel.bind(this);
      db.user.addWatch("poll-user-nav", _.bind(this.forceUpdate, this, null));
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
    }
    toggleCampaignPanel(e) {
      e.preventDefault();
      this.props.toggleCampaignPanel();
    }
    render() {
      var campaignsData = JSON.parse(localStorage.getItem('campaignsData'));
      var user = db.user.deref();
      return (
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <Link to="/" className="navbar-brand"><img src="/assets/img/atsgarage.png" id="logo" alt=""/></Link>
            </div>
            <div id="navbar" className="pull-left">
              <ul className="nav navbar-nav">
                <li><IndexLink to="/" activeClassName="active" id="link-devices">Devices</IndexLink></li>
                <li><Link to="/packages" activeClassName="active" id="link-packages">Packages</Link></li>
              </ul>
            </div>
            <ul className="right-nav pull-right">
              <li>
                {campaignsData !== null && campaignsData.length > 0 ?
                  <a href="#" className="btn-campaigns" onClick={this.toggleCampaignPanel}>
                    <img src="/assets/img/icons/wireless.png" className="icon-campaigns" alt=""/>
                  </a>
                : null}
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
