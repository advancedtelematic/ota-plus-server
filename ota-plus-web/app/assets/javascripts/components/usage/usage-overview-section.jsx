define(function(require) {
  var React = require('react'),
      moment = require('moment');
      
  class UsageOverviewSection extends React.Component {
    constructor(props) {
      super(props);
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
