define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom');

  class PackagesListItem extends React.Component {
    constructor(props) {
      super(props);
      this.itemClick = this.itemClick.bind(this);
    }
    itemClick(e) {
      this.props.expandPackage(this.props.name);
    }
    render() {
      var packageName = this.props.name;
      return (
        <button type="button" className="list-group-item" onClick={this.itemClick} id={"button-package-" + this.props.name}>
          <div className="package-item-name pull-left">
            {packageName}
          </div>

          <div className={(!this.props.queuedPackage && !this.props.selected ? "": "package-item-details ") + "pull-right"}>
            <div className="package-statuses">
              {this.props.installedPackage ?
                !this.props.selected ?
                  <span className="pull-right width-100">
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
                  </span>
                : null
              :
                !this.props.queuedPackage && !this.props.selected ? 
                  <span className="pull-right package-status-label-uninstalled">
                    Uninstalled
                  </span>
                : null
              }
            </div>
            <div className="pull-right package-statuses">
              {this.props.queuedPackage && !this.props.selected ?
                <span className="pull-right width-100">            
                  <span className="pull-right">queued</span>
                  <span className="package-name pull-right" title={this.props.queuedPackage}>{this.props.queuedPackage}&nbsp;</span>
                  <span className="pull-right">v.&nbsp;</span>
                  <span className="fa-stack package-status-circle pull-right">
                    <i className="fa fa-circle fa-stack-1x"></i>
                    <i className="fa fa-dot-circle-o fa-stack-1x orange" aria-hidden="true"></i>
                  </span>
                </span>
              : null}
            </div>
          </div>
          {this.props.isBlackListed && this.props.installedPackage && !this.props.selected ?
            <div className="pull-right">
              
            </div>
          : null}
        </button>
      );
    }
  };

  PackagesListItem.contextTypes = {
    location: React.PropTypes.object,
  };

  return PackagesListItem;
});
