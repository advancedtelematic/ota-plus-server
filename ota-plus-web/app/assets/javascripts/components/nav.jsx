define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      IndexLink = Router.IndexLink,
      SotaDispatcher = require('sota-dispatcher'),
      LanguageSelector = require('./translation/language-selector'),
      Translate = require('./translation/translate'),
      Profile = require('./profile'),
      VelocityComponent = require('mixins/velocity/velocity-component'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');;

  class Nav extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isDropdownVisible: false
      };
      this.toggleCampaignPanel = this.toggleCampaignPanel.bind(this);
      this.toggleDropdown = this.toggleDropdown.bind(this);
    }
    componentDidMount() {
      SotaDispatcher.dispatch({actionType: 'get-user'});
      jQuery('.dropdown').on('hide.bs.dropdown', function () {
        return false;
      });
    }
    toggleCampaignPanel(e) {
      e.preventDefault();
      this.props.toggleCampaignPanel();
    }
    toggleDropdown(e) {
      this.setState({
        isDropdownVisible: !this.state.isDropdownVisible
      });
    }
    render() {
      var campaignsData = JSON.parse(localStorage.getItem('campaignsData'));
      return (
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <Link to="/" className="navbar-brand"><img src="/assets/img/atslogo.png" id="logo" alt=""/></Link>
            </div>
            <div id="navbar" className="pull-left">
              <ul className="nav navbar-nav">
                <li><IndexLink to="/" activeClassName="active">Devices</IndexLink></li>
                <li><Link to="/packages" activeClassName="active">Packages</Link></li>
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
                <a className="dropdown-toggle btn-profile" href="#" onClick={this.toggleDropdown} data-toggle="dropdown">
                  <img src="/assets/img/icons/profile_icon.png" /> &nbsp;
                  <i className="fa fa-caret-down"></i>
                </a>
                <VelocityTransitionGroup enter={{animation: "fadeIn", duration: 200}} leave={{animation: "fadeOut", duration: 200}}>
                  {this.state.isDropdownVisible ? 
                    <Profile logout={this.props.logout}/>
                  : null}
                </VelocityTransitionGroup>
              </li>
            </ul>
          </div>
        </nav>
      );
    }
  }

  return Nav;
});
