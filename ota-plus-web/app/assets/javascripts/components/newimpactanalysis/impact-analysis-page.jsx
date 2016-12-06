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
        blacklistedPackagesListHeight: 300,
        chartColumnSize: {width: 880, height: 300},
        isImpactTooltipShown: false
      };
      this.setElementsSize = this.setElementsSize.bind(this);
      this.showImpactTooltip = this.showImpactTooltip.bind(this);
      this.hideImpactTooltip = this.hideImpactTooltip.bind(this);
    }
    componentDidMount() {
      var that = this;
      window.addEventListener("resize", this.setElementsSize);
      setTimeout(function() {
        that.setElementsSize();
      }, 1);
    }
    componentWillUnmount(){
      window.removeEventListener("resize", this.setElementsSize);
    }
    setElementsSize() {
      var windowWidth = jQuery(window).width();
      var windowHeight = jQuery(window).height();
      var chartColumnSize = {
        width: windowWidth - $('#packages-column').width(),
        height: windowHeight - $('#chart-column').offset().top
      };
      var blacklistedPackagesListHeight = windowHeight - $('#blacklisted-packages').offset().top;
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
          <ImpactAnalysisHeader />
          <div className="panel panel-ats">
            <div className="panel-heading">
              <div className="panel-heading-left pull-left">
                Blacklisted Packages
              </div>
            </div>
            <div className="panel-body">
              <div id="packages-column">
                <ImpactAnalysisBlacklistedPackages 
                  blacklistedPackagesListHeight={this.state.blacklistedPackagesListHeight}/>
              </div>
      
              <div id="chart-column" style={this.state.chartColumnSize}>
                <ImpactAnalysisChart />
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return ImpactAnalysisPage;
});
