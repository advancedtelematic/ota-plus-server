define(function(require) {
  var React = require('react');
      
  class ImpactAnalysisBlacklistedPackagesVersions extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      var versions = _.map(this.props.versions, function(version, i) {
        return (
          <li key={"blacklisted-package-version-" + version.version}>
            <div className="column column-first">
              {version.version}
            </div>
            <div className="column column-second">
              {version.devicesCount}
            </div>
            <div className="column column-third">
              {version.groupsCount}
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
