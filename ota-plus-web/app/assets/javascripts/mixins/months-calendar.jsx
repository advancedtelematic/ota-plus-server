define(function(require) {
  var React = require('react'),
      moment = require('moment');
  
  var MonthsCalendar = function(props) {
    return (
      <div className="months-calendar">
        <YearChooser 
          year={props.year}
          selectYear={props.selectYear}/>
        <Months 
          month={props.month}
          selectMonth={props.selectMonth}/>
      </div>
    );
  }
  
  MonthsCalendar.propTypes = {
    month: React.PropTypes.number.isRequired,
    year: React.PropTypes.number.isRequired,
    selectMonth: React.PropTypes.func.isRequired,
    selectYear: React.PropTypes.func.isRequired
  };
  
  var YearChooser = function(props) {
    var currentYear = props.year;
    return (
      <div className="year-chooser">
        <button onClick={props.selectYear.bind(this, currentYear - 1)} className="select-year prev-year"><i className="fa fa-angle-left"></i></button>
        <div className="current-year">{currentYear}</div>
        <button onClick={props.selectYear.bind(this, currentYear + 1)} className="select-year next-year"><i className="fa fa-angle-right"></i></button>
      </div>
    );
  };
  
  YearChooser.propTypes = {
    year: React.PropTypes.number.isRequired,
    selectYear: React.PropTypes.func.isRequired
  };
  
  var Months = function(props) {
    var months = _.map(moment.monthsShort(), function(month, index) {
      return (
        <li key={month} className={props.month - 1 == index ? "selected" : null}>
          <button type="button" onClick={props.selectMonth.bind(this, index + 1)}>
            {month}
          </button>
        </li>
      );
    });
    return (
      <ul className="months">
        {months}
      </ul>
    );
  };
  
  Months.propTypes = {
    month: React.PropTypes.number.isRequired,
    selectMonth: React.PropTypes.func.isRequired
  };
  
  return MonthsCalendar;
});