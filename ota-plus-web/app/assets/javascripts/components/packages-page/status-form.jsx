define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      DoughnutChart = require('react-chartjs').Doughnut,
      SearchBar = require('es6!../searchbar');

  class StatusForm extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        selectedGroups: []
      };
      this.selectAllGroups = this.selectAllGroups.bind(this);
      this.clearSelectedGroups = this.clearSelectedGroups.bind(this);
    }
    selectAllGroups(e) {
      e.preventDefault();
    }
    clearSelectedGroups(e) {
      e.preventDefault();
    }
    render() {
      var data = [
        {
          value: 30,
          color:"#1D5F6F",
          highlight: "#1D5F6F",
        },
        {
          value: 60,
          color: "#96DCD1",
          highlight: "#96DCD1",
        },
        {
          value: 20,
          color: "#AAA",
          highlight: "#AAA",
        },
        {
          value: 90,
          color: "#CCCCCC",
          highlight: "#CCCCCC",
        }];
      return (
        <div id="modal-package-status" className="myModal">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" onClick={this.props.closeForm}></button>
                <h4 className="modal-title">
                  <img src="/assets/img/icons/pie_chart.png" className="icon" alt="" />&nbsp;
                  Status
                </h4>
              </div>
              <div className="modal-body">
               <div className="column-filter">
                 <div className="filter-header">Filter</div>
                 <div className="filter-subheader">
                   <a href="#" className="pull-left" onClick={this.selectAllGroups}>Select all</a>
                   <a href="#" className="pull-right" onClick={this.clearSelectedGroups}>Clear</a>
                 </div>
                 <div className="filter-groups">
                   grupy
                 </div>
               </div>
               <div className="column-stats">
                 <DoughnutChart data={data} width="250" height="250" options={{percentageInnerCutout: 60, segmentStrokeWidth: 5, showTooltips: false}}/>
               </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  StatusForm.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return StatusForm;
});
