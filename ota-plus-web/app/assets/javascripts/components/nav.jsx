define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
      LanguageSelector = require('./translation/language-selector'),
      Translate = require('./translation/translate'),
      SearchBar = require('./searchbar');

  class Nav extends React.Component {
    render() {        
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
          <LanguageSelector class="lang-selector pull-right" currentLang={this.props.currentLang} changeLang={this.props.changeLang}/>
          <Link to="newDevice" className="btn-add margin-top-10 margin-left-30 pull-right">
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
