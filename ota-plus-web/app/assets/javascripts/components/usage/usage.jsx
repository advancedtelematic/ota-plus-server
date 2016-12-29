define(function(require) {
  var React = require('react'),
      moment = require('moment'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      UsageHeader = require('./usage-header'),
      UsageCalendarSection = require('./usage-calendar-section'),
      UsageOverviewSection = require('./usage-overview-section'),
      NoAccess = require('../noaccess');

  class Usage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        contentHeight: 300,
        month: parseInt(moment().format('MM')),
        year: parseInt(moment().format('YYYY'))
      };
      this.setContentHeight = this.setContentHeight.bind(this);
      this.selectMonth = this.selectMonth.bind(this);
      this.selectYear = this.selectYear.bind(this);
    }
    componentDidMount() {
      window.addEventListener("resize", this.setContentHeight);
      this.setContentHeight();
    }
    componentDidUpdate(prevProps, prevState) {
      if(prevProps.hasBetaAccess !== this.props.hasBetaAccess) {
        this.setContentHeight();
      }
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setContentHeight);
    }
    setContentHeight() {
      if(this.props.hasBetaAccess) {
        var windowHeight = jQuery(window).height();
        this.setState({
          contentHeight: windowHeight - jQuery('.grey-header').offset().top - jQuery('.grey-header').outerHeight()
        });
      }
    }
    selectMonth(month) {
      this.setState({month: month});
    }
    selectYear(year) {
      this.setState({year: year});
    }
    render() {
      return (
        this.props.hasBetaAccess ?
          <div>
            <UsageHeader />
            <div id="usage" style={{height: this.state.contentHeight}}>
              <div id="calendar-section" className="height-100">
                <UsageCalendarSection 
                  month={this.state.month}
                  year={this.state.year}
                  selectMonth={this.selectMonth}
                  selectYear={this.selectYear}/>
              </div>
              <div id="overview-section" className="height-100">
                <UsageOverviewSection 
                  month={this.state.month}/>
              </div>
            </div>
          </div>
        :
          <NoAccess />
      );
    }
  }
  return Usage;
});
