define(function(require) {
  var React = require('react'),
      DoughnutChart = require('react-chartjs').Doughnut;
      
  class ImpactAnalysisChart extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        packageStatsData: [
          {
            percent: 50,
            packageName: 'Anti-lock breaking system',
            devicesCount: '20.000',
            groupsCount: '20'
          },
          {
            percent: 20,
            packageName: 'Bluetooth',
            devicesCount: '20.000',
            groupsCount: '20'
          },
          {
            percent: 15,
            packageName: 'Nano',
            devicesCount: '20.000',
            groupsCount: '20'
          },
          {
            percent: 10,
            packageName: 'System',
            devicesCount: '20.000',
            groupsCount: '20'
          },
          {
            percent: 10,
            packageName: 'Sports suspension',
            devicesCount: '20.000',
            groupsCount: '20'
          },
        ]
      };
    }
    render() {
      var availableColors = [
        '#1D5E6F',
        '#9DDDD4',
        '#D3D3D3',
        '#9B9B9B',
        '#4A4A4A'
      ];
      var stats = [];
      var legend = [];
      _.each(this.state.packageStatsData, function(pack, index) {
        if(index < availableColors.length) {
          stats.push(
            {
              value: pack.percent,
              color: availableColors[index],
              highlight: availableColors[index],
              label: pack.packageName,
              packageData: pack
            }
          );
        }
      }, this);
      
      _.each(stats, function(stat) {
        legend.push(
          <li key={"stats-" + stat.packageData.packageName}>
            <div className="color-box" style={{backgroundColor: stat.color}}></div> 
            <div className="title-box">{stat.packageData.percent}%</div>
            <div className="subtitle-box">{stat.packageData.packageName}</div>
            <div className="subtitle-box">{stat.packageData.devicesCount} Devices</div>
            <div className="subtitle-box">{stat.packageData.groupsCount} Groups</div>
          </li>
        );
      }, this);
      
      return (
        <div className="chart-stats center-xy">
          <DoughnutChart data={stats} width="300" height="300" options={{
              percentageInnerCutout: 65, 
              segmentStrokeWidth: 5, 
              showTooltips: true,
            }}/>
          <ul>
            {legend}
          </ul>
        </div>
      );
    }
  };

  return ImpactAnalysisChart;
});
