define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      Loader = require('es6!../loader');

  class BlacklistedPackagesListItem extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      var pack = this.props.package;
      return (
        <div className="impact-analysis-blacklisted-package">
          <div className="pull-left">
            {pack.packageId.name}
          </div>
          <div className="pull-right margin-left-15">
            v. {pack.packageId.version}
          </div>
        </div>
      );
    }
  };

  return BlacklistedPackagesListItem;
});
