define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
      LanguageSelector = require('./translation/language-selector'),
      Translate = require('./translation/translate'),
      SearchBar = require('./searchbar'),
      ChangePassword = require('./changepass');

  class Nav extends React.Component {
    constructor(props) {
      super(props);
      this.toggleCampaignPanel = this.toggleCampaignPanel.bind(this);
    }
    toggleCampaignPanel(e) {
      e.preventDefault();
      this.props.toggleCampaignPanel();
    }
    render() {      
      var campaignsData = JSON.parse(localStorage.getItem('campaignsData'));
      return (
        <ReactCSSTransitionGroup
          transitionAppear={true}
          transactionLeave={false}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
          transitionName="example">
          <nav className="navbar navbar-inverse navbar-fixed-top">
            <div className="navbar-header">
              <Link to="/" className="navbar-brand"><img src="/assets/img/atslogo.png" id="logo" alt=""/></Link>
            </div>
            <ul className="right-nav pull-right">
              <li>
                <Link to="newdevice" className="btn-add">
                  <img src="/assets/img/icons/add.png" alt="" />
                </Link>
              </li>
              <li>
                {campaignsData !== null && campaignsData.length > 0 ? 
                  <a href="#" className="btn-campaigns" onClick={this.toggleCampaignPanel}>
                    <img src="/assets/img/icons/wireless.png" className="icon-campaigns" alt=""/>
                  </a>
                : null}
              </li>
              <li className="dropdown" id="menuLogin">
                <a className="dropdown-toggle btn-profile" href="#" data-toggle="dropdown">
                  <img src="/assets/img/icons/profile_icon.png" />
                </a>
                <ChangePassword />
              </li>
            </ul>
            <SearchBar class="search-bar margin-top-10 pull-right" changeFilter={this.props.changeFilter} filterValue={this.props.filterValue}/>
          </nav>
        </ReactCSSTransitionGroup>
      );
    }
  }
  
  return Nav;
});
