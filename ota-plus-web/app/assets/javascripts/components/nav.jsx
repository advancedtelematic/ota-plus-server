define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      IndexLink = Router.IndexLink,
      ProgressBar = require('mixins/react-progressbar'),
      Circle = ProgressBar.Circle,
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      LanguageSelector = require('es6!./translation/language-selector'),
      Translate = require('./translation/translate'),
      Profile = require('es6!./user/profile'),
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
      this.setUploadData = this.setUploadData.bind(this);
      db.user.addWatch("poll-user-nav", _.bind(this.forceUpdate, this, null));
      db.impactAnalysis.addWatch("poll-impact-analysis-nav", _.bind(this.forceUpdate, this, null));
      db.postUpload.addWatch("poll-upload-nav", _.bind(this.setUploadData, this, null));
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
      db.postUpload.removeWatch("poll-upload-nav");
    }
    toggleCampaignPanel(e) {
      e.preventDefault();
      this.props.toggleCampaignPanel();
    }
    openUploadModal(e) {
      e.preventDefault();
      this.props.openUploadModal();
    }
    setUploadData() {
      var data = !_.isUndefined(db.postUpload.deref()) ? db.postUpload.deref()['create-package'] : undefined;
      
      if(!_.isUndefined(data)) {
        var totalUploadSize = 0;
        var totalUploaded = 0;
        _.each(data, function(upload, uploadKey) {
          totalUploadSize += upload.size;
          totalUploaded += upload.uploaded;
        });
        var uploadProgress = Math.round((totalUploaded/totalUploadSize) * 100);
        this.setState({uploadProgress: (uploadProgress < 100 ? uploadProgress : undefined)});
      }
    }
    render() {
      var campaignsData = JSON.parse(localStorage.getItem('campaignsData'));
      var impactAnalysis = db.impactAnalysis.deref();
      var user = db.user.deref();
      var barOptions = {
        strokeWidth: 16,
        easing: 'easeInOut',
        color: '#C5E5E2',
        trailColor: '#eee',
        trailWidth: 16,
        svgStyle: null
      };
      
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
              {!_.isUndefined(this.state.uploadProgress) ?
                <li id="li-upload-nav-bar">
                  <a href="#" id="upload-nav-bar" className="upload-bar" onClick={this.openUploadModal}>
                    <Circle
                      progress={this.state.uploadProgress/100}
                      options={barOptions}
                      initialAnimate={false}
                      containerStyle={{width: '30px', height: '30px'}}/>
                  </a>
                </li>
              : undefined}
              <li id="li-impactanalysis">
                <Link to="/impactanalysis" activeClassName="active" id="link-impactanalysis" className={(_.isUndefined(impactAnalysis) || _.isEmpty(impactAnalysis) ? "disabled" : "")}>
                  {_.isUndefined(impactAnalysis) ? 
                    <span>
                      <i className="fa fa-circle-o-notch fa-spin"></i> &nbsp;
                    </span>
                  : undefined}
                  Threats
                </Link>
              </li>
              {campaignsData !== null && campaignsData.length > 0 ?
                <li>
                  <a href="#" className="btn-campaigns" onClick={this.toggleCampaignPanel}>
                    <img src="/assets/img/icons/wireless.png" className="icon-campaigns" alt=""/>
                  </a>
                </li>
              : null}
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
