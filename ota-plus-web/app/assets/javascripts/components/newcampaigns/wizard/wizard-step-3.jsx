define(function(require) {
  var React = require('react'),
      moment = require('moment'),
      Calendar = require('../../../mixins/calendar');

  class WizardStep3 extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        startDate:  this.props.wizardData !== null && !_.isUndefined(this.props.wizardData[2]) && !_.isUndefined(this.props.wizardData[2].startDate) ? this.props.wizardData[2].startDate : moment().startOf("day"),
        endDate:  this.props.wizardData !== null && !_.isUndefined(this.props.wizardData[2]) && !_.isUndefined(this.props.wizardData[2].endDate) ? this.props.wizardData[2].endDate : moment().startOf("day").add(1, "d")
      };
      
      this.changeStartDate = this.changeStartDate.bind(this);
      this.changeEndDate = this.changeEndDate.bind(this);
      this.previousDayStartDate = this.previousDayStartDate.bind(this);
      this.nextDayStartDate = this.nextDayStartDate.bind(this);
      this.previousDayEndDate = this.previousDayEndDate.bind(this);
      this.nextDayEndDate = this.nextDayEndDate.bind(this);
      this.setWizardData = this.setWizardData.bind(this);
    }
    componentDidMount() {
      this.setWizardData(this.state.startDate, this.state.endDate);
    }
    changeStartDate(day) {
      var startDate = day.date;
      var endDate = this.state.endDate;
      
      if(startDate.diff(endDate, 'days') > 0) {
        endDate = startDate;
        this.setState({endDate: endDate});
      }
      this.setState({startDate: startDate});
      this.setWizardData(startDate, endDate);
    }
    changeEndDate(day) {
      var startDate = this.state.startDate;
      var endDate = day.date;
      
      if(endDate.diff(startDate, 'days') < 0) {
        startDate = endDate;
        this.setState({startDate: startDate});
      }
      this.setState({endDate: endDate});
      this.setWizardData(startDate, endDate);
    }
    previousDayStartDate() {
      this.changeStartDate({date: this.state.startDate.add(-1, "d")});
    }
    nextDayStartDate() {
      this.changeStartDate({date: this.state.startDate.add(1, "d")});
    }
    previousDayEndDate() {
      this.changeEndDate({date: this.state.endDate.add(-1, "d")});
    }
    nextDayEndDate() {
      this.changeEndDate({date: this.state.endDate.add(1, "d")});
    }
    setWizardData(startDate, endDate) {
      var data = {startDate: startDate, endDate: endDate};
      this.props.setWizardData(data);
      this.props.markStepAsFinished();
    }
    render() {
      return (
        <div className="width-full margin-top-2 pull-left">
          <div className="width-half pull-left">
            <div className="box-bordered box-height-full">
              <div className="inner">
                <div className="row">
                  <div className="col-xs-6 col-xs-offset-2">
                    <div><strong>Start Date</strong></div>
                    <div className="calendar-switcher">
                      <i className="fa fa-angle-left" onClick={this.previousDayStartDate}></i>
                      <span>{this.state.startDate.format("ddd, D.MM.YYYY")}</span>
                      <i className="fa fa-angle-right" onClick={this.nextDayStartDate}></i>
                    </div>
                  </div>
                  <div className="col-xs-12">
                    <div className="calendar">
                      <Calendar 
                        selected={this.state.startDate}
                        changeDate={this.changeStartDate} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="width-half pull-right">
            <div className="box-bordered box-height-full">
              <div className="inner">
                <div className="row">
                  <div className="col-xs-6 col-xs-offset-2">
                    <div><strong>End Date</strong></div>
                    <div className="calendar-switcher">
                      <i className="fa fa-angle-left" onClick={this.previousDayEndDate}></i>
                      <span>{this.state.endDate.format("ddd, D.MM.YYYY")}</span>
                      <i className="fa fa-angle-right" onClick={this.nextDayEndDate}></i>
                    </div>
                  </div>
                  <div className="col-xs-12">
                    <div className="calendar">
                      <Calendar 
                        selected={this.state.endDate} 
                        changeDate={this.changeEndDate} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
  return WizardStep3;
});
