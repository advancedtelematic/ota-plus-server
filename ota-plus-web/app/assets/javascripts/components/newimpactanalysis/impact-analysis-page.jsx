define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Loader = require('es6!../loader'),
      ImpactAnalysisHeader = require('es6!./impact-analysis-header'),
      ImpactAnalysisBlacklistedPackages = require('es6!./impact-analysis-blacklisted-packages'),
      ImpactAnalysisChart = require('es6!./impact-analysis-chart');
  
  class ImpactAnalysisPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        blacklistedPackagesData: undefined,
        blacklistedPackagesListHeight: 300,
        chartColumnSize: {width: 880, height: 300},
        isImpactTooltipShown: false,
        groupCount: undefined
      };
      this.setBlacklistedPackagesData = this.setBlacklistedPackagesData.bind(this);
      this.setImpactAnalysisData = this.setImpactAnalysisData.bind(this);
      this.setElementsSize = this.setElementsSize.bind(this);
      this.showImpactTooltip = this.showImpactTooltip.bind(this);
      this.hideImpactTooltip = this.hideImpactTooltip.bind(this);
      SotaDispatcher.dispatch({actionType: 'get-blacklisted-packages-with-stats'});
      SotaDispatcher.dispatch({actionType: 'impact-analysis'});
      db.blacklistedPackagesWithStats.addWatch("poll-blacklisted-packages-with-stats", _.bind(this.setBlacklistedPackagesData, this, null));
      db.impactAnalysis.addWatch("poll-new-impact-analysis-page", _.bind(this.setImpactAnalysisData, this, null));
    }
    componentDidMount() {
      var that = this;
      window.addEventListener("resize", this.setElementsSize);
      setTimeout(function() {
        that.setElementsSize();
      }, 1);
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setElementsSize);
      db.blacklistedPackagesWithStats.removeWatch("poll-blacklisted-packages-with-stats");
      db.impactAnalysis.removeWatch("poll-new-impact-analysis-page");
      db.blacklistedPackagesWithStats.reset();
      db.impactAnalysis.reset();
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
          groupedPackages[obj.packageId.name].deviceCount += obj.statistics.deviceCount;
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
    setElementsSize() {
      var windowWidth = jQuery(window).width();
      var windowHeight = jQuery(window).height();
      var chartColumnSize = {
        width: windowWidth - $('#packages-column').width(),
        height: windowHeight - $('#chart-column').offset().top
      };
      var blacklistedPackagesListHeight = windowHeight - $('#packages-column').offset().top;
      this.setState({
        blacklistedPackagesListHeight: blacklistedPackagesListHeight,
        chartColumnSize: chartColumnSize,
      });
    }
    showImpactTooltip() {
      this.setState({isImpactTooltipShown: true});
    }
    hideImpactTooltip() {
      this.setState({isImpactTooltipShown: false});
    }
    render() {
      return (
        <div>
          <ImpactAnalysisHeader 
            deviceCount={(!_.isUndefined(this.state.impactAnalysisData) ? Object.keys(this.state.impactAnalysisData).length : undefined)}
            groupCount={this.state.groupCount}/>
          <div className="panel panel-ats">
            <div className="panel-heading">
              <div className="panel-heading-left pull-left">
                Blacklisted Packages
              </div>
            </div>
            <div className="panel-body">
              <div id="packages-column">
                <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
                  {!_.isUndefined(this.state.blacklistedPackagesData) ?
                    <ImpactAnalysisBlacklistedPackages 
                      blacklistedPackagesListHeight={this.state.blacklistedPackagesListHeight}
                      packages={this.state.blacklistedPackagesData}/>
                  : undefined}
                </VelocityTransitionGroup>
                {_.isUndefined(this.state.blacklistedPackagesData) ?
                  <Loader />
                : undefined}
              </div>
      
              <div id="chart-column" style={this.state.chartColumnSize}>
                <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
                  {!_.isUndefined(this.state.blacklistedPackagesData) ?    
                    <ImpactAnalysisChart 
                      packages={this.state.blacklistedPackagesData}/>
                  : undefined}
                </VelocityTransitionGroup>
                {_.isUndefined(this.state.blacklistedPackagesData) ?
                  <Loader />
                : undefined}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return ImpactAnalysisPage;
});
