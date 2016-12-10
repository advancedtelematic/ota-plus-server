define(function(require) {
  var React = require('react'),
      ReactI18next = require('reactI18next'),
      DoughnutChart = require('react-chartjs').Doughnut;
      
  class ImpactAnalysisChart extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      const { t } = this.props;
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
      _.each(this.props.packages, function(pack, index) {
        if(index < availableColors.length) {
          colorIndex++;
          stats.push(
            {
              value: pack.deviceCount,
              groupIds: pack.groupIds,
              color: availableColors[colorIndex],
              highlight: availableColors[colorIndex],
              label: (index === availableColors.length - 1 ? groupedStatsName : pack.packageName)
            }
          );
        } else if(index >= availableColors.length) {
          stats[availableColors.length - 1].value = pack.deviceCount + stats[availableColors.length - 1].value;
          stats[availableColors.length - 1].groupIds = _.union(pack.groupIds, stats[availableColors.length - 1].groupIds);
        }
      }, this);
      
      var legend = _.map(stats, function(stat) {
        return (
          <li key={"color-" + stat.label + "-" + stat.color}>
            <div className="color-box" style={{backgroundColor: stat.color}}></div> 
            <div className="title-box">{stat.label}</div>
            <div className="subtitle-box">{t('common.deviceWithCount', {count: stat.value})}</div>
            <div className="subtitle-box">{t('common.groupWithCount', {count: Object.keys(stat.groupIds).length})}</div>
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

  return ReactI18next.translate()(ImpactAnalysisChart);
});
