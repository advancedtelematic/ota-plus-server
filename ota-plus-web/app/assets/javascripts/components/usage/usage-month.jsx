define(function(require) {
  var React = require('react');
      
  class UsageMonth extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      const { width, date, usage } = this.props;
      return (
        <div className="usage-month-wrapper" style={{width: width + '%'}}>
          <div className="panel panel-grey">
            <div className="panel-heading">{date.format('MMM YYYY')}</div>
            <div className="panel-body">
              <div className="devices-count">{usage.totalActivatedDevices.deviceCount}</div>
              <div className="devices-count-desc">Total activated devices</div>
              <div className="devices-count">{usage.activatedDevices.deviceCount}</div>
              <div className="devices-count-desc">New devices activated this month</div>
              <div className="devices-count">{usage.activeDevices.numberOfDevices}</div>
              <div className="devices-count-desc">Devices connected this month</div>
            </div>
          </div>
        </div>
      );
    }
  };
  
  UsageMonth.propTypes = {
    usage: React.PropTypes.object.isRequired,
    date: React.PropTypes.object.isRequired
  };

  return UsageMonth;
});
