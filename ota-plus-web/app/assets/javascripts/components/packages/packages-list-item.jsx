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
        <button type="button" className="list-group-item" onClick={this.itemClick}>
          <div className="pull-left">
            <span className="package-name">{this.props.name}</span>
          </div>
          <div className="pull-right package-statuses">
            {this.props.installedPackage ? 
              <span className="pull-right">
                <span className="fa-stack package-status-circle">
                  <i className="fa fa-circle fa-stack-1x"></i>
                  <i className="fa fa-check-circle fa-stack-1x green" aria-hidden="true"></i>
                </span>
                v. {this.props.installedPackage} installed        
              </span>
            : 
              <span className="pull-right package-status-label-uninstalled">
                Uninstalled        
              </span>
            }
          </div>
          <div className="pull-right package-statuses">
            {this.props.queuedPackage ? 
              <span className="pull-right">
                <span className="fa-stack package-status-circle">
                  <i className="fa fa-circle fa-stack-1x"></i>
                  <i className="fa fa-dot-circle-o fa-stack-1x orange" aria-hidden="true"></i>
                </span>
                v. {this.props.queuedPackage} queued        
              </span>
              
            : null }
          </div>
        </button>
      );
    }
  };

  return PackagesListItem;
});
