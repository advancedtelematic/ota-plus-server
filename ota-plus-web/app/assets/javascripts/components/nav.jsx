define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
      LanguageSelector = require('./translation/language-selector'),
      Translate = require('./translation/translate'),
      SearchBar = require('./searchbar');

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
  
            <a href="/logout" className="btn btn-grey btn-logout pull-right">Logout</a>
            {campaignsData !== null && campaignsData.length > 0 ? 
              <a href="#" className="btn-campaigns pull-right" onClick={this.toggleCampaignPanel}>
                <img src="/assets/img/icons/wireless.png" className="icon-campaigns" alt=""/>
              </a>
            : null}
            <LanguageSelector class="lang-selector pull-right" currentLang={this.props.currentLang} changeLang={this.props.changeLang}/>
            <Link to="newdevice" className="btn-add margin-top-10 margin-left-30 pull-right">
              <img src="/assets/img/icons/add.png" alt="" />
            </Link>
            <SearchBar class="search-bar margin-top-10 pull-right" changeFilter={this.props.changeFilter} filterValue={this.props.filterValue}/>
          </nav>
        </ReactCSSTransitionGroup>
      );
    }
  }
  
  return Nav;
});
