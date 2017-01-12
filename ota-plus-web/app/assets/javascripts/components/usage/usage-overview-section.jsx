define(function(require) {
  var React = require('react'),
      moment = require('moment'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      Loader = require('../loader');
      
  class UsageOverviewSection extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        activeDevicesPerMonthData: undefined,
        activatedDevicesPerPeriodData: undefined,
        totalActivatedDevicesData: undefined
      };            
      var startTime = moment([this.props.year, this.props.month]).add(-1,"month").format();
      var endTime = moment([this.props.year, this.props.month]).format();
      this.handleActiveDevicesPerMonth = this.handleActiveDevicesPerMonth.bind(this);
      this.handleActivatedDevicesPerPeriod = this.handleActivatedDevicesPerPeriod.bind(this);
      this.handleTotalActivatedDevices = this.handleTotalActivatedDevices.bind(this);
      SotaDispatcher.dispatch({actionType: 'get-active-devices-per-month', year: this.props.year, month: this.props.month});
      SotaDispatcher.dispatch({actionType: 'get-activated-devices-per-period', start: startTime, end: endTime});
      SotaDispatcher.dispatch({actionType: 'get-total-activated-devices', end: endTime});
      db.activeDevicesPerMonth.addWatch("poll-active-devices-per-month", _.bind(this.handleActiveDevicesPerMonth, this, null));
      db.activatedDevicesPerPeriod.addWatch("poll-activated-devices-per-period", _.bind(this.handleActivatedDevicesPerPeriod, this, null));
      db.totalActivatedDevices.addWatch("poll-total-activated-devices", _.bind(this.handleTotalActivatedDevices, this, null));
    }
    componentWillReceiveProps(nextProps) {
      if(nextProps.year !== this.props.year || nextProps.month !== this.props.month) {
        var startTime = moment([nextProps.year, nextProps.month - 1]).format();
        var endTime = moment([nextProps.year, nextProps.month - 1]).add(1, "months").format();
        this.setState({
          activeDevicesPerMonthData: undefined,
          activatedDevicesPerPeriodData: undefined,
        });
        SotaDispatcher.dispatch({actionType: 'get-active-devices-per-month', year: nextProps.year, month: nextProps.month});
        SotaDispatcher.dispatch({actionType: 'get-activated-devices-per-period', start: startTime, end: endTime});
        SotaDispatcher.dispatch({actionType: 'get-total-activated-devices', end: endTime});
      }
    }
    componentWillUnmount() {
      db.activeDevicesPerMonth.removeWatch("poll-active-devices-per-month");
      db.activatedDevicesPerPeriod.removeWatch("poll-activated-devices-per-period");
      db.totalActivatedDevices.removeWatch("poll-total-activated-devices");
    }
    handleActiveDevicesPerMonth() {
      if(!_.isUndefined(db.activeDevicesPerMonth.deref())) {
        this.setState({activeDevicesPerMonthData: db.activeDevicesPerMonth.deref()});
      }
    }
    handleActivatedDevicesPerPeriod() {
      if(!_.isUndefined(db.activatedDevicesPerPeriod.deref())) {
        this.setState({activatedDevicesPerPeriodData: db.activatedDevicesPerPeriod.deref()});
      }
    }
    handleTotalActivatedDevices() {
      if(!_.isUndefined(db.totalActivatedDevices.deref())) {
        this.setState({totalActivatedDevicesData: db.totalActivatedDevices.deref()});
      }
    }
    render() {
      return (
        <div className="overview-inner">
          <h3 className="overview-title">Overview</h3>
          <div className="panel panel-grey">
            <div className="panel-heading">{moment(this.props.month, 'MM').format('MMM')}</div>
            <div className="panel-body">
              <div className="center-xy">
                <div className="lightgrey margin-top-20">Total activated devices</div>
                {!_.isUndefined(this.state.totalActivatedDevicesData) ?
                  <div className="devices-count">
                    {this.state.totalActivatedDevicesData.deviceCount}
                  </div>
                : undefined}
                {_.isUndefined(this.state.totalActivatedDevicesData) ? 
                  <Loader />
                : undefined}

                <div className="lightgrey">New devices activated this month</div>
                {!_.isUndefined(this.state.activatedDevicesPerPeriodData) ?
                  <div className="devices-count">
                    {this.state.activatedDevicesPerPeriodData.deviceCount}
                  </div>
                : undefined}
                {_.isUndefined(this.state.activeDevicesPerMonthData) ? 
                  <Loader />
                : undefined}

                <div className="lightgrey margin-top-20">Devices connected this month</div>
                {!_.isUndefined(this.state.activeDevicesPerMonthData) ?
                  <div className="devices-count">
                    {this.state.activeDevicesPerMonthData.numberOfDevices}
                  </div>
                : undefined}
                {_.isUndefined(this.state.activeDevicesPerMonthData) ? 
                  <Loader />
                : undefined}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
  
  UsageOverviewSection.propTypes = {
    month: React.PropTypes.number.isRequired
  };

  return UsageOverviewSection;
});
