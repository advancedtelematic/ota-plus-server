define(function(require) {
  var React = require('react');
      
  class ImpactAnalysisBlacklistedPackagesVersions extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      var versions = _.map(this.props.versions, function(version, i) {
        return (
          <li key={"blacklisted-package-version-" + version.packageId.version}>
            <div className="column column-first">
              {version.packageId.version}
            </div>
            <div className="column column-second">
              {version.statistics.deviceCount}
            </div>
            <div className="column column-third">
              {Object.keys(version.statistics.groupIds).length}
            </div>
          </li>
        );
      }, this);
      return (
         <div className="package-details">
          <ul>
            {versions}
          </ul>
        </div>
      );
    }
  };

  return ImpactAnalysisBlacklistedPackagesVersions;
});
