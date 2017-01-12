define(function(require) {
  var React = require('react');

  class PackagesListItemOnDevice extends React.Component {
    constructor(props) {
      super(props);
    }
    formBlacklist(action, e) {
      this.props.showBlacklistForm(this.props.package.id.name, this.props.package.id.version, action);
    }
    render() {
      const pack = this.props.package;
      return (
        <div className="package-version package-ondevice">
          <div className="package-item-name pull-left">
            <span title={pack.id.name}>{pack.id.name}</span> &nbsp;
          </div>
          
          <div className="package-right-box pull-right text-right">
            <div className="package-statuses pull-right">
              <div className="package-version-name pull-left">
                {pack.id.version}
              </div>
              <div className="pull-right">
                {pack.isBlackListed ?
                  <button className="btn btn-blacklist btn-edit-blacklist" onClick={this.formBlacklist.bind(this, 'edit')} title="Edit blacklisted package version" id={"button-edit-blacklisted-package-" + pack.id.name + "-" + pack.id.version}></button>
                : 
                  <button className="btn btn-blacklist btn-add-blacklist" onClick={this.formBlacklist.bind(this, 'add')} title="Blacklist package version" id={"button-blacklist-package-" + pack.id.name + "-" + pack.id.version}></button>
                }
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
  
  PackagesListItemOnDevice.propTypes = {
    package: React.PropTypes.object.isRequired,
    showBlacklistForm: React.PropTypes.func.isRequired
  };

  return PackagesListItemOnDevice;
});
