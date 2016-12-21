define(function(require) {
  var React = require('react');

  class PackagesListItem extends React.Component {
    constructor(props) {
      super(props);
      this.itemClick = this.itemClick.bind(this);
    }
    itemClick(e) {
      this.props.expandPackage(this.props.name);
    }
    render() {
      return (
        <div className="list-group-item-wrapper">
          <button type="button" className="list-group-item" onClick={this.itemClick} id={"button-package-" + this.props.name}>
            <div className="package-item-name pull-left">
              <span title={this.props.name}>{this.props.name}</span>
            </div>
          
            <div className="package-item-status pull-right">
              <div className="package-statuses pull-right">
                {!this.props.isSelected ?
                  this.props.installedPackage ?
                    <span>
                      <span className="pull-right">
                        <label className={"label label-auto-update" + (this.props.isAutoInstallEnabled ? " active" : "")}>Auto</label>
                      </span>
                    </span>
                  : 
                    this.props.queuedPackage ?
                      <span>
                        <span className="pull-right">
                          <label className={"label label-auto-update" + (this.props.isAutoInstallEnabled ? " active" : "")}>Auto</label>
                        </span>
                        <span className="pull-right">queued</span>
                        <span className="package-name pull-right" title={this.props.queuedPackage}>{this.props.queuedPackage}&nbsp;</span>
                        <span className="pull-right">v.&nbsp;</span>
                        <span className="fa-stack package-status-circle pull-right">
                          <i className="fa fa-circle fa-stack-1x"></i>
                          <i className="fa fa-dot-circle-o fa-stack-1x orange" aria-hidden="true"></i>
                        </span>
                      </span>
                    : 
                      <span>
                        <span className="pull-right">
                          <label className={"label label-auto-update" + (this.props.isAutoInstallEnabled ? " active" : "")}>Auto</label>
                        </span>
                      </span>
                : null}
              </div>
            </div>
          </button>
          {this.props.isSelected ?
            <div className="auto-update-toggle">
              Automatic update
              <div className={"switch" + (this.props.isAutoInstallEnabled ? " switchOn" : "")} onClick={this.props.toggleAutoInstall.bind(this, this.props.name, this.props.isAutoInstallEnabled)}>
                <div className="switch-status">
                  {this.props.isAutoInstallEnabled ?
                    <span>ON</span>
                  :
                    <span>OFF</span>
                  }
                </div>
              </div>
            </div>
          : null}
        </div>
      );
    }
  };

  return PackagesListItem;
});
