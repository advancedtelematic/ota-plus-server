define(function(require) {
  var React = require('react'),
      moment = require('moment'),
      UsageMonth = require('./usage-month');
      
  class UsageDetails extends React.Component {
    constructor(props) {
      super(props);      
    }
    render() {
      const { usage } = this.props;
      const months = _.map(usage, function(usageMonth, key) {
        return (
          <UsageMonth 
            key={key}
            width={Math.min(100/Object.keys(usage).length, 50)}
            date={moment(key, 'YYYYMM')}
            usage={usageMonth}/>
        );
      });
      return (
        <span>
          {months}
        </span>
      );
    }
  };
  
  UsageDetails.propTypes = {
    usage: React.PropTypes.object.isRequired
  };

  return UsageDetails;
});
