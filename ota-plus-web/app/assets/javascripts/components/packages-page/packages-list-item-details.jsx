define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      PackagesListItemDetailsVersion = require('./packages-list-item-details-version');

  class PackageListItemDetails extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      var versions = _.map(this.props.versions, function(version, i) {
        return (
          <PackagesListItemDetailsVersion
            version={version}
            showBlacklistForm={this.props.showBlacklistForm}
            key={'package-' + this.props.packageName + '-' + version.id.version}
            queryPackagesData={this.props.queryPackagesData}/>
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

  return PackageListItemDetails;
});
