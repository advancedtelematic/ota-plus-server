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
        activeDevicesPerMonthData: undefined
      };
      this.handleActiveDevicesPerMonth = this.handleActiveDevicesPerMonth.bind(this);
      SotaDispatcher.dispatch({actionType: 'get-active-devices-per-month', year: this.props.year, month: this.props.month});
      db.activeDevicesPerMonth.addWatch("poll-active-devices-per-month", _.bind(this.handleActiveDevicesPerMonth, this, null));
    }
    componentWillReceiveProps(nextProps) {
      if(nextProps.year !== this.props.year || nextProps.month !== this.props.month) {
        this.setState({activeDevicesPerMonthData: undefined});
        SotaDispatcher.dispatch({actionType: 'get-active-devices-per-month', year: nextProps.year, month: nextProps.month});
      }
    }
    componentWillUnmount() {
      db.activeDevicesPerMonth.removeWatch("poll-active-devices-per-month");
    }
    handleActiveDevicesPerMonth() {
      if(!_.isUndefined(db.activeDevicesPerMonth.deref())) {
        this.setState({activeDevicesPerMonthData: db.activeDevicesPerMonth.deref()});
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
                <div className="lightgrey">Active devices</div>
                <div className="devices-count">10.000.000</div>
                <div className="lightgrey margin-top-20">Connected this month</div>
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
