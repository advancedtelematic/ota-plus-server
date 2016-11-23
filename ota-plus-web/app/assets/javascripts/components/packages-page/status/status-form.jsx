define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      Link = Router.Link,
      DoughnutChart = require('react-chartjs').Doughnut,
      GroupsList = require('es6!./groups-list');

  class StatusForm extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        packageStatsData: undefined,
        packageStatsDataNotFiltered: undefined,
        selectedGroups: [],
        isFilteringEnabled: false
      };
      this.setData = this.setData.bind(this);
      this.selectAllGroups = this.selectAllGroups.bind(this);
      this.clearSelectedGroups = this.clearSelectedGroups.bind(this);
      this.toggleGroup = this.toggleGroup.bind(this);
      this.filterPackageVersions = this.filterPackageVersions.bind(this);
      SotaDispatcher.dispatch({actionType: 'get-package-stats', packageName: this.props.packageName});
      db.packageStats.addWatch("poll-package-stats", _.bind(this.setData, this, null));
    }
    setData() {
      var packageStats = db.packageStats.deref();
      if(!_.isUndefined(packageStats)) {
        packageStats = _.sortBy(packageStats, function(stat) {
          return stat.value;
        }).reverse();
        this.setState({
          packageStatsData: packageStats,
          packageStatsDataNotFiltered: packageStats
        });
      }
    }
    selectAllGroups(e) {
      if(e)
        e.preventDefault();
      if(!_.isUndefined(db.groups.deref()))
        this.setState({
          selectedGroups: _.pluck(db.groups.deref(), 'id')
        });
    }
    clearSelectedGroups(e) {
      e.preventDefault();
      this.setState({
        selectedGroups: []
      });
    }
    toggleGroup(groupUUID) {
      var selectedGroups = this.state.selectedGroups;
      var index = 0;
      if(index = selectedGroups.indexOf(groupUUID) > -1) {
        selectedGroups = selectedGroups.filter(function(i) {
          return i != groupUUID;
        });
      } else {
        selectedGroups.push(groupUUID);
      }
      this.setState({
        selectedGroups: selectedGroups
      });
    }
    filterPackageVersions() {
      
    }
    render() {
      var availableColors = [
        '#1D5E6F',
        '#9DDDD4',
        '#D3D3D3',
        '#9B9B9B',
        '#4A4A4A'
      ];
      var groupedStatsName = 'Other';
      var colorIndex = -1;
      var stats = [];
      _.each(this.state.packageStatsData, function(version, index) {
        if(index < availableColors.length) {
          colorIndex++;
          stats.push(
            {
              value: version.installedCount,
              color: availableColors[colorIndex],
              highlight: availableColors[colorIndex],
              label: (index === availableColors.length - 1 ? groupedStatsName : "v. " + version.packageVersion)
            }
          );
        } else if(index >= availableColors.length) {
          var previousCount = stats[availableColors.length - 1].value;
          stats[availableColors.length - 1].value = version.installedCount + previousCount;
        }
      }, this);
      
      var legend = _.map(stats, function(stat) {
        return (
          <li key={"color-" + stat.label + "-" + stat.color}>
            <div className="color-box" style={{backgroundColor: stat.color}}></div> 
            <div className="title-box">{stat.label}</div>
            <div className="subtitle-box">{stat.value} Devices</div>
          </li>
        );
      }, this);
      
      return (
        <div id="modal-package-status" className="myModal">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" onClick={this.props.closeForm}></button>
                <h4 className="modal-title">
                  <img src="/assets/img/icons/pie_chart.png" className="icon" alt="" />&nbsp;
                  Status - Package {this.props.packageName}
                </h4>
              </div>
              <div className="modal-body">
                {this.state.isFilteringEnabled ? 
                  <div className="column-filter">
                    <div className="filter-header">Filter</div>
                    <div className="filter-subheader">
                      <a href="#" className="pull-left" onClick={this.selectAllGroups}>Select all</a>
                      <a href="#" className="pull-right" onClick={this.clearSelectedGroups}>Clear</a>
                    </div>
                    <div className="filter-groups">
                    <GroupsList 
                      selectAllGroups={this.selectAllGroups}
                      toggleGroup={this.toggleGroup}
                      selectedGroups={this.state.selectedGroups}/>
                    </div>
                  </div>
                : null}
                <div className="chart-stats" style={!this.state.isFilteringEnabled ? {width: "100%"} : null}>
                  <DoughnutChart data={stats} width="250" height="250" options={{
                      percentageInnerCutout: 60, 
                      segmentStrokeWidth: 5, 
                      showTooltips: true,
                    }}/>
                  <ul>
                    {legend}
                  </ul>
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
