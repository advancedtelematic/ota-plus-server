define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      PackagesListItemDetailsVersion = require('./packages-list-item-details-version');

  class PackageListItemDetails extends React.Component {
    constructor(props) {
      super(props);

      this.refreshData = this.refreshData.bind(this);
      this.installPackage = this.installPackage.bind(this);
    }
    installPackage(packageName, packageVersion, e) {
      e.preventDefault();
      jQuery('.btn-install').attr('disabled', true).unbind('click');
      var data = {
        name: packageName,
        version: packageVersion
      };

      SotaDispatcher.dispatch({
        actionType: 'install-package-for-device',
        data: data,
        device: this.props.deviceId
      });

      this.refreshData();
    }
    refreshData() {
      SotaDispatcher.dispatch({actionType: "get-package-queue-for-device", device: this.props.deviceId});
    }
    render() {
      var versions = _.map(this.props.versions, function(version, i) {
        return (
          <PackagesListItemDetailsVersion
            version={version}
            isQueued={this.props.isQueued}
            installPackage={this.installPackage}
            key={'package-' + this.props.packageName + '-' + version.id.version}/>
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
