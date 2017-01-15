define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Loader = require('../loader'),
      ImpactAnalysisHeader = require('./impact-analysis-header'),
      ImpactAnalysisBlacklistedPackages = require('./impact-analysis-blacklisted-packages'),
      ImpactAnalysisChart = require('./impact-analysis-chart'),
      ModalTooltip = require('../modal-tooltip');
  
  class ImpactAnalysisPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        blacklistedPackagesData: undefined,
        contentHeight: 300,
        isImpactTooltipShown: false,
        groupCount: undefined
      };
      this.setBlacklistedPackagesData = this.setBlacklistedPackagesData.bind(this);
      this.setImpactAnalysisData = this.setImpactAnalysisData.bind(this);
      this.setContentHeight = this.setContentHeight.bind(this);
      this.showImpactTooltip = this.showImpactTooltip.bind(this);
      this.hideImpactTooltip = this.hideImpactTooltip.bind(this);
      SotaDispatcher.dispatch({actionType: 'get-blacklisted-packages-with-stats'});
      SotaDispatcher.dispatch({actionType: 'impact-analysis'});
      db.blacklistedPackagesWithStats.addWatch("poll-blacklisted-packages-with-stats", _.bind(this.setBlacklistedPackagesData, this, null));
      db.impactAnalysis.addWatch("poll-impact-analysis-page", _.bind(this.setImpactAnalysisData, this, null));
    }
    componentDidMount() {
      window.addEventListener("resize", this.setContentHeight);
      this.setContentHeight();
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setContentHeight);
      db.blacklistedPackagesWithStats.removeWatch("poll-blacklisted-packages-with-stats");
      db.impactAnalysis.removeWatch("poll-impact-analysis-page");
      db.blacklistedPackagesWithStats.reset();
    }
    setBlacklistedPackagesData() {
      var blacklistedPackages = db.blacklistedPackagesWithStats.deref();
      var groupedPackages = {};
      var groups = [];
      if(!_.isUndefined(blacklistedPackages)) {
        _.each(blacklistedPackages, function(obj, index){
          if(_.isUndefined(groupedPackages[obj.packageId.name]) || !groupedPackages[obj.packageId.name] instanceof Array ) {
            groupedPackages[obj.packageId.name] = new Object();
            groupedPackages[obj.packageId.name] = {
              elements: [],
              packageName: obj.packageId.name,
              deviceCount: 0,
              groupIds: []
            };
          }
          groupedPackages[obj.packageId.name].deviceCount += !_.isUndefined(obj.statistics.deviceCount) ? obj.statistics.deviceCount : 0;
          if(!_.isUndefined(obj.statistics.groupIds))
            groupedPackages[obj.packageId.name].groupIds = _.union(groupedPackages[obj.packageId.name].groupIds, obj.statistics.groupIds);
          groupedPackages[obj.packageId.name].elements.push(blacklistedPackages[index]);
          groups = _.union(groupedPackages[obj.packageId.name].groupIds, groups);
        });
        _.each(groupedPackages, function(obj, index) {
          groupedPackages[index].elements = _.sortBy(obj.elements, function(element) {
            return element.statistics.deviceCount;
          }).reverse();
        });
        groupedPackages = _.sortBy(groupedPackages, function(element) {
          return element.deviceCount;
        }).reverse();
        this.setState({
          blacklistedPackagesData: groupedPackages,
          groupCount: Object.keys(groups).length
        });
      }
    }
    setImpactAnalysisData() {
      this.setState({impactAnalysisData: db.impactAnalysis.deref()});
    }
    setContentHeight() {
      var windowHeight = jQuery(window).height();
      this.setState({
        contentHeight: windowHeight - $('.grey-header').offset().top - $('.grey-header').outerHeight()
      });
    }
    showImpactTooltip(e) {
      e.preventDefault();
      this.setState({isImpactTooltipShown: true});
    }
    hideImpactTooltip() {
      this.setState({isImpactTooltipShown: false});
    }
    render() {
      var tooltipContent = (
        <div className="text-center">
          <div>
            With ATS Garage, you can <strong>blacklist</strong> problem packages, ensuring they <br />won't get installed on any of your devices.
          </div>
          <div className="margin-top-20">
            On the <strong>Impact analysis tab</strong>, you can view which of your devices already <br /> 
            have the blacklisted version of the package installed, letting you <br />
            proactively troubleshoot and update those devices to a fixed version, <br />
            or roll them back to an older version.
          </div>
          <div className="margin-top-20">
            <img src="/assets/img/impact_tooltip.jpg" alt="" />
          </div>
        </div>
      );
      return (
        <div>
          <ImpactAnalysisHeader 
            deviceCount={!_.isUndefined(this.state.impactAnalysisData) ? Object.keys(this.state.impactAnalysisData).length : undefined}
            groupCount={this.state.groupCount}/>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {!_.isUndefined(this.state.blacklistedPackagesData) ? 
              !_.isEmpty(this.state.blacklistedPackagesData) ?
                <div className="panel panel-ats">
                  <div className="panel-body">
                    <ImpactAnalysisBlacklistedPackages 
                      packages={this.state.blacklistedPackagesData}
                      contentHeight={this.state.contentHeight}/>
                    <ImpactAnalysisChart 
                      packages={this.state.blacklistedPackagesData}
                      contentHeight={this.state.contentHeight}/>
                  </div>
                </div>
              :
                <div className="impact-analysis-empty" style={{height: this.state.contentHeight}}>
                  <div className="center-xy padding-15">
                    <div className="font-22">You don't have any blacklisted packages.</div>
                    <div className="margin-top-10">
                      <a href="#" className="font-18" onClick={this.showImpactTooltip}>
                        <span className="color-main"><strong>What is this?</strong></span>
                      </a>
                    </div>
                  </div>
                </div>
            : undefined}
          </VelocityTransitionGroup>
          {_.isUndefined(this.state.blacklistedPackagesData) ? 
            <div className="impact-analysis-empty" style={{height: this.state.contentHeight}}>
              <div className="center-xy padding-15">
                <Loader />
              </div>
            </div>
          : undefined}
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isImpactTooltipShown ?
              <ModalTooltip 
                title="Blacklist"
                body={tooltipContent}
                confirmButtonAction={this.hideImpactTooltip}/>
            : undefined}
          </VelocityTransitionGroup>
        </div>
      );
    }
  };

  return ImpactAnalysisPage;
});
