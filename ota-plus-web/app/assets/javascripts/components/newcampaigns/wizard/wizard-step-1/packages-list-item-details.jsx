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
        var isChosen = this.props.chosenPackage.name == version.id.name && this.props.chosenPackage.version == version.id.version;
        return (
          <PackagesListItemDetailsVersion
            version={version}
            key={'package-' + this.props.packageName + '-' + version.id.version}
            choosePackage={this.props.choosePackage}
            isChosen={isChosen}/>
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
