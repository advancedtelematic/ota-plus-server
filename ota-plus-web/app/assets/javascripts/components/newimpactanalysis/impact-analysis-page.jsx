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
        selectedSort: 'asc',
        selectedStatus: 'mostimpacted',
        selectedStatusName: 'Most impacted',
        selectedView: 'package',
        selectedViewName: 'Package',
        isImpactTooltipShown: false
      };
      
      this.setElementsSize = this.setElementsSize.bind(this);
      this.selectSort = this.selectSort.bind(this);
      this.selectStatus = this.selectStatus.bind(this);
      this.selectView = this.selectView.bind(this);
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
    selectSort(sort, e) {
      e.preventDefault();
      this.setState({
        selectedSort: sort
      });
    }
    selectStatus(status, e) {
      e.preventDefault();
      this.setState({
        selectedStatus: status,
        selectedStatusName: jQuery(e.target).text()
      });
    }
    selectView(view, e) {
      e.preventDefault();
      this.setState({
        selectedView: view,
        selectedViewName: jQuery(e.target).text()
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
                <div className="panel-subheading">
                  <div className="sort-text pull-left">
                    {this.state.selectedSort == 'asc' ? 
                      <a href="#" onClick={this.selectSort.bind(this, 'desc')} id="link-sort-packages-desc"><i className="fa fa-long-arrow-up" aria-hidden="true"></i> A &gt; Z</a>
                    :
                      <a href="#" onClick={this.selectSort.bind(this, 'asc')} id="link-sort-packages-asc"><i className="fa fa-long-arrow-down" aria-hidden="true"></i> Z &gt; A</a>
                    }
                  </div>
                  <div className="select-bar select-bar-status pull-left">
                    <div className="btn-group">
                      <button type="button" className="btn btn-grey dropdown-toggle" id="dropdown-packages-status" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="pull-left">{this.state.selectedStatusName} &nbsp;</span>
                        <span className="fa fa-angle-down pull-right"></span>
                      </button>
                      <ul className="dropdown-menu">
                        <li><a href="#" onClick={this.selectStatus.bind(this, 'mostimpacted')}>Most impacted</a></li>
                        <li><a href="#" onClick={this.selectStatus.bind(this, 'other')}>Other</a></li>
                      </ul>
                    </div>
                  </div>
                  <div className="select-bar select-bar-status pull-right">
                    <div className="btn-group">
                      <div className="select-bar-text">View</div>
                      <button type="button" className="btn btn-grey dropdown-toggle" id="dropdown-packages-view" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="pull-left">{this.state.selectedViewName} &nbsp;</span>
                        <span className="fa fa-angle-down pull-right"></span>
                      </button>
                      <ul className="dropdown-menu">
                        <li><a href="#" onClick={this.selectView.bind(this, 'package')}>Package</a></li>
                        <li><a href="#" onClick={this.selectView.bind(this, 'other')}>Other</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
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
