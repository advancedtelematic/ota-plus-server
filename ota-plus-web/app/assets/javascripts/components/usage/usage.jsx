define(function(require) {
  var React = require('react'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      moment = require('moment'),
      UsageHeader = require('./usage-header'),
      UsageDetails = require('./usage-details'),
      Loader = require('../loader');

  class Usage extends React.Component {
    constructor(props) {
      var startTime = moment([2017,0,1]);
      var endTime = moment();
      var monthsCount = endTime.diff(startTime, 'months');
      super(props);
      this.state = {
        usageData: undefined,
        monthsCount: monthsCount + 1
      };
      this.handleUsageData = this.handleUsageData.bind(this);
      for(var i = 0; i <= monthsCount; i++) {
        var startTimeTmp = moment(startTime).add(i, 'months');
        var endTimeTmp = moment(startTimeTmp).add(1, 'months');
        SotaDispatcher.dispatch({actionType: 'get-usage-per-month', startTime: startTimeTmp, endTime: endTimeTmp});
      }
      db.usagePerMonth.addWatch("poll-usage", _.bind(this.handleUsageData, this, null));
    }
    componentWillUnmount() {
      db.usagePerMonth.removeWatch("poll-usage");
    }
    handleUsageData() {
      const usagePerMonth = db.usagePerMonth.deref();
      if(!_.isUndefined(usagePerMonth)) {
        var usage = this.state.usageData || {};
        this.setState({usageData: _.extend(usage, usagePerMonth)});
      }
    }
    render() {
      return (
        <VelocityTransitionGroup enter={{animation: "fadeIn", display: "flex"}} leave={{animation: "fadeOut", display: "flex"}} runOnMount={true}>
          <div className="content-wrapper">
            <UsageHeader />
            <div className="usage-content">
              {!_.isUndefined(this.state.usageData) && Object.keys(this.state.usageData).length === this.state.monthsCount ? 
                <UsageDetails usage={this.state.usageData}/>
              : undefined}
              {_.isUndefined(this.state.usageData) || Object.keys(this.state.usageData).length !== this.state.monthsCount ?
                <Loader className="black center-xy"/>
              : null}
            </div>
          </div>
        </VelocityTransitionGroup>
      );
    }
  }
  
  return Usage;
});
