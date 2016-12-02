define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      db = require('stores/db');

  class PackagesListItem extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isAutoInstallEnabled: this.props.isAutoInstallEnabled,
      };
      this.itemClick = this.itemClick.bind(this);
    }
    componentWillReceiveProps(nextProps) {
      if(nextProps.isAutoInstallEnabled !== this.props.isAutoInstallEnabled) {
        this.setState({isAutoInstallEnabled: nextProps.isAutoInstallEnabled});
      }
    }
    itemClick(e) {
      this.props.expandPackage(this.props.name);
    }
    render() {
      var packageName = this.props.name;
      return (
        <div className="list-group-item-wrapper">
          <button type="button" className="list-group-item" onClick={this.itemClick} id={"button-package-" + this.props.name}>
            <div className="package-item-name pull-left">
              <span title={packageName}>{packageName}</span>
            </div>
          
            <div className="package-item-status pull-right">
              <div className="package-statuses pull-right">
                {!this.props.isSelected ?
                  this.props.installedPackage ?
                    <span>
                      <span className="pull-right">installed</span>
                      <span className="package-name pull-right" title={this.props.installedPackage}>{this.props.installedPackage}&nbsp;</span>
                      <span className="pull-right">v.&nbsp;</span>
                      {this.props.isBlackListed ? 
                        <i className="fa fa-exclamation-triangle icon-exclamation pull-right"></i>
                      :
                        <span className="fa-stack package-status-circle pull-right">
                          <i className="fa fa-circle fa-stack-1x"></i>
                          <i className="fa fa-check-circle fa-stack-1x green" aria-hidden="true"></i>
                        </span>
                      }
                      {this.props.hasBetaAccess && this.props.isAutoInstallEnabled ?
                        <span className="pull-right">
                          <label className="label label-success label-auto-update">Auto</label>
                        </span>
                      : null}
                    </span>
                  : 
                    this.props.queuedPackage ?
                      <span>
                        <span className="pull-right">queued</span>
                        <span className="package-name pull-right" title={this.props.queuedPackage}>{this.props.queuedPackage}&nbsp;</span>
                        <span className="pull-right">v.&nbsp;</span>
                        <span className="fa-stack package-status-circle pull-right">
                          <i className="fa fa-circle fa-stack-1x"></i>
                          <i className="fa fa-dot-circle-o fa-stack-1x orange" aria-hidden="true"></i>
                        </span>
                        {this.props.hasBetaAccess && this.props.isAutoInstallEnabled ? 
                          <span className="pull-right">
                            <label className="label label-success label-auto-update">Auto</label>
                          </span>
                        : null}
                      </span>
                    : 
                      <span>
                        <span className="package-status-label-uninstalled pull-right">Uninstalled</span>
                        {this.props.hasBetaAccess && this.props.isAutoInstallEnabled ? 
                          <span className="pull-right">
                            <label className="label label-success label-auto-update">Auto</label>
                          </span>
                        : null}
                      </span>
                : null}
              </div>
            </div>
          </button>
          {this.props.hasBetaAccess && this.props.isSelected ?
            <div className="auto-update-toggle">
              Automatic update
              <div className={"switch" + (this.state.isAutoInstallEnabled ? " switchOn" : "")} onClick={this.props.toggleAutoInstall.bind(this, this.props.name, this.state.isAutoInstallEnabled)}></div>
            </div>
          : null}
        </div>
      );
    }
  };

  PackagesListItem.contextTypes = {
    location: React.PropTypes.object,
  };

  return PackagesListItem;
});
