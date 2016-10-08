define(function(require) {
  var React = require('react'),
      GroupIcon = require('../../groups/group-icon');

  class WizardStep4 extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      var chosenGrups = this.props.wizardData[1].chosenGroups;
      var groups = [];
      for(var index in chosenGrups) {
        groups.push(
          <div className="col-xs-4" key={"chosen-group-" + chosenGrups[index]}>
            <GroupIcon name={chosenGrups[index]} count="10.000.000" />
          </div>
        );
      }
      return (
        <div>
          <div className="width-full pull-left">
            <div className="box-bordered">
              <div className="inner">
                <div><strong>Package</strong></div>
                <div className="margin-top-20 margin-left-20">
                  <div className="row">
                    <div className="col-xs-5">
                      {this.props.wizardData[0].packageName}
                    </div>
                    <div className="col-xs-5">
                      <strong>v. {this.props.wizardData[0].packageVersion}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="width-full pull-left">
            <div className="box-bordered">
              <div className="inner position-relative">
                <div><strong>Groups & Devices</strong></div>
                <div className="groups-wrapper-fade groups-wrapper-fade-top"></div>
                <div className="groups-wrapper margin-top-5">
                  {groups}
                </div>
                <div className="groups-wrapper-fade groups-wrapper-fade-bottom"></div>
              </div>
            </div>
          </div>
          <div className="width-full margin-top-2 pull-left">
            <div className="width-half pull-left">
              <div className="box-bordered">
                <div className="inner">
                  <div className="row">
                    <div className="col-xs-4">
                      <div><strong>Start Date</strong></div>
                    </div>
                    <div className="col-xs-6">
                      {this.props.wizardData[2].startDate.format("ddd, D.MM.YYYY")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="width-half pull-right">
              <div className="box-bordered">
                <div className="inner">
                  <div className="row">
                    <div className="col-xs-4">
                      <div><strong>End Date</strong></div>
                    </div>
                    <div className="col-xs-6">
                      {this.props.wizardData[2].endDate.format("ddd, D.MM.YYYY")}
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
  return WizardStep4;
});
