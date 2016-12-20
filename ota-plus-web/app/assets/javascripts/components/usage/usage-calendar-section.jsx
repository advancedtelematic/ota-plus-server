define(function(require) {
  var React = require('react'),
      MonthsCalendar = require('mixins/months-calendar');
      
  class UsageCalendarSection extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div>
          <div className="calendar-title">
            <i className="fa fa-calendar" aria-hidden="true"></i> Calendar
          </div>
          <MonthsCalendar 
            month={this.props.month}
            year={this.props.year}
            selectMonth={this.props.selectMonth}
            selectYear={this.props.selectYear}/>
        </div>
      );
    }
  };
  
  UsageCalendarSection.propTypes = {
    month: React.PropTypes.number.isRequired,
    year: React.PropTypes.number.isRequired,
    selectMonth: React.PropTypes.func.isRequired,
    selectYear: React.PropTypes.func.isRequired
  };

  return UsageCalendarSection;
});
